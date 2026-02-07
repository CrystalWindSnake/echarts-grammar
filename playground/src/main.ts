import scenarios from "./scenario-registry";

const container = document.getElementById("btns")!;

scenarios.forEach((s) => {
  const btn = document.createElement("button");
  btn.innerText = s.name;
  btn.onclick = () => s.run();
  container.appendChild(btn);
});
