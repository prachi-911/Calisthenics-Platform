const Workout = require("../models/Workout");
const Exercise = require("../models/Exercise");
const Program = require("../models/Program");

const globalSearchService = async (queryString = {}) => {
  const query = queryString.q || queryString.search || "";
  const type = queryString.type || "all"; // all, workouts, exercises, programs
  const limit = Math.max(1, Math.min(20, parseInt(queryString.limit, 10) || 5));

  if (!query.trim()) {
    return {
      success: true,
      message: "Please provide a search term",
      data: {
        workouts: [],
        exercises: [],
        programs: [],
      },
    };
  }

  const regex = { $regex: query, $options: "i" };

  const promises = [];

  if (type === "all" || type === "workouts") {
    promises.push(
      Workout.find({
        $or: [
          { workoutName: regex },
          { description: regex },
          { targetMuscle: regex },
          { category: regex },
        ],
      })
        .select("workoutName category difficulty duration thumbnail isPremium")
        .limit(limit)
    );
  } else {
    promises.push(Promise.resolve([]));
  }

  if (type === "all" || type === "exercises") {
    promises.push(
      Exercise.find({
        $or: [
          { name: regex },
          { description: regex },
          { category: regex },
          { targetMuscles: regex },
        ],
      })
        .select("name category difficulty targetMuscles thumbnail isPremium")
        .limit(limit)
    );
  } else {
    promises.push(Promise.resolve([]));
  }

  if (type === "all" || type === "programs") {
    promises.push(
      Program.find({
        $or: [
          { title: regex },
          { description: regex },
          { category: regex },
          { level: regex },
          { tags: regex },
        ],
      })
        .select("title level category durationWeeks thumbnail isPremium enrolledCount")
        .limit(limit)
    );
  } else {
    promises.push(Promise.resolve([]));
  }

  const [workouts, exercises, programs] = await Promise.all(promises);

  return {
    success: true,
    message: "Search completed successfully",
    query,
    totalResults: workouts.length + exercises.length + programs.length,
    data: {
      workouts,
      exercises,
      programs,
    },
  };
};

module.exports = {
  globalSearchService,
};
