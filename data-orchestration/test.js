const { orchestrator } = require("./orchestrator");

async function test(){
    let result = await  orchestrator(90.0, 0).then(data => {
        weatherData = data;
    });

    console.log(result);
}
test();