import PathInfo from '../models/pathinfo.model.js';

export const addPathInfo = async (req, res) => {

  console.log("hi");

  try {
    
    const { pathId, timeRange, date, score, level } = req.body;
    console.log(pathId);
    if (!pathId || !timeRange || !date || score == null || !level) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const formattedDate = new Date(date);

    formattedDate.setHours(0, 0, 0, 0);


    const existingEntries = await PathInfo.find({ pathId, timeRange, date: formattedDate });
    

    if (existingEntries.length === 0) {

      const newPathInfo = new PathInfo({

        pathId,

        timeRange,

        date: formattedDate,

        score,

        level,

      });

      await newPathInfo.save();

      console.log("new entry");
      

      return res.status(201).json({ message: 'Path info added successfully.', data: newPathInfo });

    } else {

      const totalScore = existingEntries.reduce((sum, entry) => sum + entry.score, 0) + score;

      const newScore = totalScore / (existingEntries.length + 1);

      await PathInfo.updateMany(

        { pathId, timeRange, date: formattedDate },

        { $set: { score: newScore, level } }

      );

      

      console.log("updated entry");
      console.log(newScore);
      


      return res.status(200).json({

        message: 'Existing path info updated with average score.',

        data: { pathId, timeRange, date: formattedDate, score: newScore, level },

      });

    }

  } catch (error) {

    console.error(error);

    res.status(500).json({ message: 'Server error. Please try again later.' });

  }
};



export const getLast8DaysData = async (req, res) => {
  try {
    const { pathId, timeRange } = req.query;

    if (!pathId || !timeRange) {
      return res.status(400).json({ message: 'Path ID and Time Range are required.' });
    }

    // Set the date range
    const currentDate = new Date(new Date().toISOString().split('T')[0]); // Strip time for UTC midnight
    currentDate.setDate(currentDate.getDate());
    const startDate = new Date(currentDate);
    startDate.setDate(currentDate.getDate() - 8);

    // Query the database
    const data = await PathInfo.find({
      pathId,
      timeRange,
      date: { $gte: startDate, $lte: currentDate },
    }).sort({ date: 1 }); // Sort by date in ascending order for graph plotting

    // Prepare data for graph
    const graphData = data.map(entry => ({
      date: entry.date.toISOString().split('T')[0], // Format date as YYYY-MM-DD
      score: entry.score,
    }));

    // Send the response
    res.status(200).json({ message: 'Data retrieved successfully.', data: graphData });
  } catch (error) {
    console.error("Error fetching last 8 days data:", error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};




/*export const getScoresByTime = async (req, res) => {
  const { pathId, date } = req.query;

  console.log(pathId);
  console.log(date);
  
  

  if (!pathId || !date) {
    return res.status(400).json({ error: 'pathId and date are required' });
  }
    

  try {
    // Replace with actual database logic
    const data = await PathInfo.find({
      pathId,
      date,
    });

    console.log(data);

    // if (!data.length) {
    //   return res.status(404).json({ message: 'No data found for the selected path and date' });
    // }

    res.status(200).json({ data });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'An error occurred while fetching data' });
  }
};*/

export const getScoresByTime = async (req, res) => {
  const { pathId, date } = req.query;

  if (!pathId || !date) {
    return res.status(400).json({ error: 'pathId and date are required' });
  }

  try {
    // Parse the date from the frontend to a Date object
    const startOfDay = new Date(date);
    const endOfDay = new Date(date);
    endOfDay.setDate(endOfDay.getDate() + 1); // Move to the next day
    endOfDay.setMilliseconds(-1); // Set time to the last millisecond of the day

    // Query the database for the range
    const data = await PathInfo.find({
      pathId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });


    if (!data.length) {
      return res.status(404).json({ message: 'No data found for the selected path and date' });
    }

    res.status(200).json({ data });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'An error occurred while fetching data' });
  }
};


