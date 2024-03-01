const config = require("./config.js")
const pre = require("./pre.js")
module.exports = async (kernel) => {
  let script = {
    run: [{
      // differentialdiffusion
      method: "shell.run",
      params: {
        message: [
          "git clone https://huggingface.co/spaces/cocktailpeanut/differential-diffusion app",
        ]
      }
    }, {
      method: "shell.run",
      params: {
        venv: "env",
        path: "app",
        message: [
          (kernel.gpu === 'nvidia' ?  "pip install -r requirements.txt" : 'pip install -r requirements-mps.txt')
        ],
      }
    }, {
      // depthanything
      method: "shell.run",
      params: {
        message: [
          "git clone https://github.com/peanutcocktail/Depth-Anything depth_anything"
        ],
        path: "app"
      }
    }, {
      method: "shell.run",
      params: {
        venv: "../env",
        path: "app/depth_anything",
        message: [
          "pip install -r requirements.txt"
        ],
      }
    }, {
      method: "shell.run",
      params: {
        venv: "app/env",
        message: [
          "pip install -r depth-requirements.txt",
          "pip install transformers"
        ],
      }
    }, {
      method: "fs.share",
      params: {
        venv: "app/env"
      }
    }, {
      method: "notify",
      params: {
        html: "Click the 'start' tab to get started!"
      }
    }]
  }
  let pre_command = pre(config, kernel)
  if (pre_command) {
    script.run[1].params.message = [pre_command].concat(script.run[1].params.message)
  }
  return script
}
