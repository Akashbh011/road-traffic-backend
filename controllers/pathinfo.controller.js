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







export const getLast8DaysData = async (req, res) => {

  try {

    const { pathId, timeRange } = req.query;

    if (!pathId || !timeRange) {

      return res.status(400).json({ message: 'Path ID and Time Range are required.' });

    }

    const currentDate = new Date();

    const startDate = new Date();

    startDate.setDate(currentDate.getDate() - 8);

    const data = await PathInfo.find({

      pathId,

      timeRange,

      date: { $gte: startDate, $lte: currentDate },

    }).sort({ date: 1 }); // Sort by date in ascending order for graph plotting

    console.log(data);

    // Prepare the data for the line graph (date vs. score)

    const graphData = data.map(entry => ({

      date: entry.date.toISOString().split('T')[0], // Format date as YYYY-MM-DD

      score: entry.score,

    }));



    res.status(200).json({ message: 'Data retrieved successfully.', data: graphData });
    console.log("Data sent to frontend");

  } catch (error) {

    console.error(error);

    res.status(500).json({ message: 'Server error. Please try again later.' });

  }

};


/*export const getLast8DaysData = async (req, res) => {
  try {
    const { pathId, timeRange } = req.query;

    if (!pathId || !timeRange) {
      return res.status(400).json({ message: 'Path ID and Time Range are required.' });
    }

    const currentDate = new Date();
    const startDate = new Date();
    currentDate.setUTCHours(0, 0, 0, 0); // Reset to midnight UTC
    startDate.setUTCHours(0, 0, 0, 0);
    startDate.setDate(currentDate.getDate() - 8); // 8 days ago

    console.log({ pathId, timeRange, startDate, currentDate });

    const data = await PathInfo.find({
      pathId,
      timeRange,
      date: { $gte: startDate, $lte: currentDate },
    }).sort({ date: 1 });

    console.log("Query Result:", data);

    if (data.length === 0) {
      return res.status(404).json({ message: 'No data found for the selected path and time range.' });
    }

    const graphData = data.map(entry => ({
      date: entry.date.toISOString().split('T')[0], // Format date as YYYY-MM-DD
      score: entry.score,
    }));

    res.status(200).json({ message: 'Data retrieved successfully.', data: graphData });
    console.log("Data sent to frontend");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};*/

