import PathInfo from '../models/pathinfo.model.js';

export const addPathInfo = async (req, res) => {

  try {

    const { pathId, timeRange, date, score, level } = req.body;

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

      return res.status(201).json({ message: 'Path info added successfully.', data: newPathInfo });

    } else {

      const totalScore = existingEntries.reduce((sum, entry) => sum + entry.score, 0) + score;

      const newScore = totalScore / (existingEntries.length + 1);

      await PathInfo.updateMany(

        { pathId, timeRange, date: formattedDate },

        { $set: { score: newScore, level } }

      );


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


export const getLast8DaysDataForAllPaths = async (req, res) => {
  try {
    const { timeRange } = req.query;

    if (!timeRange) {
      return res.status(400).json({ message: 'Time Range is required.' });
    }

    const currentDate = new Date(new Date().toISOString().split('T')[0]);
    currentDate.setDate(currentDate.getDate() - 1);
    const startDate = new Date(currentDate);
    startDate.setDate(currentDate.getDate() - 7);

    const paths = ['Katraj-Kondhwa', 'Swargate-Katraj', 'Kothrud-Shivajinagar'];
    const data = {};

    // Fetch data for each path
    for (const pathId of paths) {
      const pathData = await PathInfo.find({
        pathId,
        timeRange,
        date: { $gte: startDate, $lte: currentDate },
      }).sort({ date: 1 });

      data[pathId] = pathData.map(entry => ({
        date: entry.date.toISOString().split('T')[0],
        score: entry.score,
      }));
    }

    // Structure response for triple line graph
    const responseData = {
      labels: data[paths[0]].map(entry => entry.date), // Dates are common across paths
      datasets: paths.map((pathId, index) => ({
        label: pathId,
        data: data[pathId].map(entry => entry.score),
        borderColor: index === 0 ? 'red' : index === 1 ? 'blue' : 'green',
        borderWidth: 2,
        fill: false,
      })),
    };

    res.status(200).json({ message: 'Data for all paths retrieved successfully.', data: responseData });
    console.log("Data for all paths sent to frontend");
  } catch (error) {
    console.error("Error fetching last 8 days data for all paths:", error);
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
    currentDate.setDate(currentDate.getDate()-1);
    const startDate = new Date(currentDate);
    startDate.setDate(currentDate.getDate() - 7);

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
    console.log("Data sent to frontend");
  } catch (error) {
    console.error("Error fetching last 8 days data:", error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};




export const getScoresByTime = async (req, res) => {
  const { pathId, date } = req.query;

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
};

