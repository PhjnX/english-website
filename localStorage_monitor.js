// localStorage Monitor - để debug localStorage changes
// Thêm vào đầu main.tsx hoặc App.tsx để monitor

const originalSetItem = localStorage.setItem;
const originalRemoveItem = localStorage.removeItem;
const originalClear = localStorage.clear;

localStorage.setItem = function (key, value) {
  if (key === "user_completed_exercises") {
    console.log("📝 localStorage.setItem called for user_completed_exercises");
    console.log("📝 Value:", value);
    console.trace("📝 Call stack:");
  }
  return originalSetItem.call(this, key, value);
};

localStorage.removeItem = function (key) {
  if (key === "user_completed_exercises") {
    console.log(
      "🗑️ localStorage.removeItem called for user_completed_exercises"
    );
    console.trace("🗑️ Call stack:");
  }
  return originalRemoveItem.call(this, key);
};

localStorage.clear = function () {
  console.log("🧹 localStorage.clear called");
  console.trace("🧹 Call stack:");
  return originalClear.call(this);
};

console.log("📊 localStorage monitor installed");
