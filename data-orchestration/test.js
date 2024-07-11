const { orchestrator } = require("./orchestrator");

async function test(){
    let result = await  orchestrator(66.0, 66.0).then(data => {
        weatherData = data;
    });

    console.log(result);
}
test();