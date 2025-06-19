// Test script để kiểm tra và clean up localStorage
// Chạy trong console của browser để test

console.log("=== LocalStorage Cleanup Test ===");

// 1. Kiểm tra dữ liệu hiện tại
const currentData = localStorage.getItem("user_completed_exercises");
if (currentData) {
  const exercises = JSON.parse(currentData);
  console.log("Current exercises:", exercises.length);
  console.log("Current data:", exercises);
  
  // 2. Tìm duplicates
  const duplicates = [];
  exercises.forEach((ex, index) => {
    const found = exercises.findIndex((other, otherIndex) => 
      otherIndex !== index && 
      ex.level === other.level && 
      ex.readingNum === other.readingNum &&
      ex.type === other.type
    );
    if (found !== -1) {
      duplicates.push(ex);
    }
  });
  
  console.log("Found duplicates:", duplicates.length);
  if (duplicates.length > 0) {
    console.log("Duplicate entries:", duplicates);
  }
  
  // 3. Clean up
  const uniqueExercises = exercises.filter((exercise, index, self) => {
    return index === self.findIndex((ex) => 
      ex.level === exercise.level && 
      ex.readingNum === exercise.readingNum &&
      ex.type === exercise.type
    );
  });
  
  // 4. Chuẩn hóa title
  const normalizedExercises = uniqueExercises.map((ex) => ({
    ...ex,
    title: ex.type === "reading-practice" ? `Reading ${ex.readingNum}` : ex.title
  }));
  
  // 5. Sắp xếp
  normalizedExercises.sort((a, b) => {
    if (a.level !== b.level) return a.level - b.level;
    return a.readingNum - b.readingNum;
  });
  
  console.log("After cleanup:", normalizedExercises.length);
  console.log("Clean data:", normalizedExercises);
  
  // 6. Lưu lại
  localStorage.setItem("user_completed_exercises", JSON.stringify(normalizedExercises));
  console.log("✅ Cleanup completed!");
  
} else {
  console.log("No data found in localStorage");
}

console.log("=== End Test ===");
