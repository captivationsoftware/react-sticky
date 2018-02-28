export default `
body {
  font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
  padding: 0;
  margin: 0;
  margin-top: 2rem;
  font-size: 16px;
  line-height: 1rem;
}

h1 {
  line-height: 2rem;
}

h2 {
  line-height: 1.5rem;
}

.navbar {
  position: fixed;
  top: 0;
  padding: .5rem;
  background: white;
  z-index: 10;
}

.header {
  height: 80px;
  overflow: auto;
  background: #aaa;
}

.container {
  height: 500px;
  background: #ddd;
  padding: 0 2rem;
}

.gap {
  height: 500px;
}

.gap.short {
  height: 250px;
}

.gap.tall {
  height: 1000px;
}

.container.relative {
  overflow-y: auto;
}
`;
