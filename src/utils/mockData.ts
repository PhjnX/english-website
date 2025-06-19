// Mock data for testing dashboard
export const mockCompletedExercises = [
  {
    id: "read001",
    title: "The History of Glass",
    level: 1,
    readingNum: 1,
    score: 9,
    totalQuestions: 13,
    dateCompleted: "2024-06-10T10:30:00Z",
    type: "reading-practice" as const,
  },
  {
    id: "read002",
    title: "Volcanoes - A Fiery Force",
    level: 1,
    readingNum: 2,
    score: 11,
    totalQuestions: 13,
    dateCompleted: "2024-06-11T14:15:00Z",
    type: "reading-practice" as const,
  },
  {
    id: "read005",
    title: "The Life of a Honeybee",
    level: 2,
    readingNum: 1,
    score: 12,
    totalQuestions: 14,
    dateCompleted: "2024-06-13T09:45:00Z",
    type: "reading-practice" as const,
  },
  {
    id: "read008",
    title: "Exploring the Deep Sea",
    level: 2,
    readingNum: 2,
    score: 10,
    totalQuestions: 14,
    dateCompleted: "2024-06-14T16:20:00Z",
    type: "reading-practice" as const,
  },
  {
    id: "read012",
    title: "The Art of Storytelling",
    level: 3,
    readingNum: 1,
    score: 8,
    totalQuestions: 15,
    dateCompleted: "2024-06-16T11:10:00Z",
    type: "reading-practice" as const,
  },
];

// Function to set mock data for testing
export const setMockCompletedExercises = () => {
  localStorage.setItem(
    "user_completed_exercises",
    JSON.stringify(mockCompletedExercises)
  );
};

// Function to save reading practice result - cải tiến để tránh trùng lặp hoàn toàn
export const saveReadingPracticeResult = (result: {
  level: number;
  readingNum: number;
  title: string;
  score: number;
  totalQuestions: number;
}) => {
  console.log("🔵 saveReadingPracticeResult called with:", result);
  
  try {
    const existingData = localStorage.getItem("user_completed_exercises");
    let exercises = existingData ? JSON.parse(existingData) : [];
    
    console.log("🔵 Current exercises in localStorage:", exercises.length);

    const exerciseId = `read_${result.level}_${result.readingNum}`;
    
    // Chuẩn hóa title thành format "Reading {readingNum}"
    const standardizedTitle = `Reading ${result.readingNum}`;

    // Tìm bài đã tồn tại với cùng level và readingNum
    const existingIndex = exercises.findIndex(
      (ex: any) =>
        ex.level === result.level && ex.readingNum === result.readingNum
    );

    const newExercise = {
      id: exerciseId,
      title: standardizedTitle, // Sử dụng title chuẩn hóa
      level: result.level,
      readingNum: result.readingNum,
      score: result.score,
      totalQuestions: result.totalQuestions,
      dateCompleted: new Date().toISOString(),
      type: "reading-practice" as const,
    };

    console.log("🔵 New exercise object:", newExercise);

    if (existingIndex >= 0) {
      // Update existing entry - luôn update để có điểm mới nhất
      exercises[existingIndex] = newExercise;
      console.log(`🟢 Updated reading practice result: Level ${result.level}, Reading ${result.readingNum}, Score: ${result.score}/${result.totalQuestions}`);
    } else {
      // Thêm bài mới
      exercises.push(newExercise);
      console.log(`🟢 Added new reading practice result: Level ${result.level}, Reading ${result.readingNum}, Score: ${result.score}/${result.totalQuestions}`);
    }

    // Loại bỏ bất kỳ duplicates nào có thể tồn tại
    const uniqueExercises = exercises.filter((exercise: any, index: number, self: any[]) => {
      return index === self.findIndex((ex: any) => 
        ex.level === exercise.level && 
        ex.readingNum === exercise.readingNum &&
        ex.type === exercise.type
      );
    });

    console.log(`🔵 After deduplication: ${uniqueExercises.length} exercises`);

    // Sắp xếp theo level, sau đó theo readingNum để dễ quản lý
    uniqueExercises.sort((a: any, b: any) => {
      if (a.level !== b.level) return a.level - b.level;
      return a.readingNum - b.readingNum;
    });

    localStorage.setItem("user_completed_exercises", JSON.stringify(uniqueExercises));
    console.log(`✅ Total unique exercises saved to localStorage: ${uniqueExercises.length}`);
    
    // Verify save
    const savedData = localStorage.getItem("user_completed_exercises");
    if (savedData) {
      const savedExercises = JSON.parse(savedData);
      console.log(`✅ Verification: ${savedExercises.length} exercises confirmed in localStorage`);
    } else {
      console.error("❌ Verification failed: No data found in localStorage after save");
    }
    
  } catch (error) {
    console.error("❌ Error saving reading practice result:", error);
  }
};

// Function to clear all completed exercises (useful for testing or reset)
export const clearCompletedExercises = () => {
  try {
    localStorage.removeItem("user_completed_exercises");
    console.log("Cleared all completed exercises");
  } catch (error) {
    console.error("Error clearing completed exercises:", error);
  }
};

// Function to clean up duplicate entries in localStorage
export const cleanupDuplicateExercises = () => {
  try {
    const existingData = localStorage.getItem("user_completed_exercises");
    if (!existingData) return;

    const exercises = JSON.parse(existingData);
    
    // Loại bỏ duplicates dựa trên level, readingNum, và type
    const uniqueExercises = exercises.filter((exercise: any, index: number, self: any[]) => {
      return index === self.findIndex((ex: any) => 
        ex.level === exercise.level && 
        ex.readingNum === exercise.readingNum &&
        ex.type === exercise.type
      );
    });

    // Chuẩn hóa title
    const normalizedExercises = uniqueExercises.map((ex: any) => ({
      ...ex,
      title: ex.type === "reading-practice" ? `Reading ${ex.readingNum}` : ex.title
    }));

    // Sắp xếp
    normalizedExercises.sort((a: any, b: any) => {
      if (a.level !== b.level) return a.level - b.level;
      return a.readingNum - b.readingNum;
    });

    localStorage.setItem("user_completed_exercises", JSON.stringify(normalizedExercises));
    console.log(`Cleaned up duplicates. Unique exercises: ${normalizedExercises.length}, Original: ${exercises.length}`);
    
    return normalizedExercises;
  } catch (error) {
    console.error("Error cleaning up duplicate exercises:", error);
    return null;
  }
};

// Function to get reading practice statistics
export const getReadingPracticeStats = () => {
  try {
    const existingData = localStorage.getItem("user_completed_exercises");
    if (!existingData) return { totalCompleted: 0, averageScore: 0, byLevel: {} };

    const exercises = JSON.parse(existingData);
    const readingPractices = exercises.filter((ex: any) => ex.type === "reading-practice");

    const totalCompleted = readingPractices.length;
    const totalScore = readingPractices.reduce((sum: number, ex: any) => sum + ex.score, 0);
    const averageScore = totalCompleted > 0 ? Math.round((totalScore / totalCompleted) * 100) / 100 : 0;

    // Group by level
    const byLevel = readingPractices.reduce((acc: any, ex: any) => {
      if (!acc[ex.level]) {
        acc[ex.level] = { completed: 0, totalScore: 0, averageScore: 0 };
      }
      acc[ex.level].completed += 1;
      acc[ex.level].totalScore += ex.score;
      acc[ex.level].averageScore = Math.round((acc[ex.level].totalScore / acc[ex.level].completed) * 100) / 100;
      return acc;
    }, {});

    return { totalCompleted, averageScore, byLevel };
  } catch (error) {
    console.error("Error getting reading practice stats:", error);
    return { totalCompleted: 0, averageScore: 0, byLevel: {} };
  }
};
