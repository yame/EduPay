
export const useCounterStore = defineStore("counter", () => {
  //👉 - state
  const counter = ref(0)


  //👉 - Actions
  const increment = () => {
    counter.value++;
  };

  const decrement = () => {
    if (counter.value > 0) {
      counter.value--;
    }
  };
  const clear = () => {
    counter.value = 0
  }

  return {
    counter,
    increment,
    decrement,
    clear
  };
}, {
  persist: true
})
