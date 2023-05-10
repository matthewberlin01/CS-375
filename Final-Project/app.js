let stats_data = [
    {id: 'heads-count', coinFace: 'Heads', value: 0},
    {id: 'tails-count', coinFace: 'Tails', value: 0}
];

const MARGINS = {top: 20, bottom: 10};
const CHART_WIDTH = 250;
const CHART_HEIGHT = 200;
const TEXT_BAR_WIDTH = 50;
const TEXT_BAR_HEIGHT = 50;

const x = d3.scaleBand().rangeRound([25, CHART_WIDTH]).padding(0.5);
const y = d3.scaleLinear().range([CHART_HEIGHT, 10]);


let heads = d3.select(stats_data[0].id);
let tails = d3.select(stats_data[1].id);
let coin = d3.select(".coin");
let flipButton = d3.select("#flip-button");
let resetButton = d3.select("#reset-button");

let statsChart = d3
    .select('svg')
    .classed('barChart', true)
    .attr('width', CHART_WIDTH)
    .attr('height', CHART_HEIGHT + MARGINS.top + MARGINS.bottom);

x.domain(stats_data.map((d) => d.coinFace));
y.domain([0, 1]);

let barChart = statsChart.append('g');

barChart
    .append('g')
    .call(d3.axisBottom(x).tickSizeOuter(0))
    .attr('transform', `translate(0, ${CHART_HEIGHT})`)
    .attr('color', '#424ae0');

barChart
    .append('g')
    .call(d3.axisLeft(y).tickSizeOuter(0))
    .attr('transform', 'translate(30, 0)')
    .attr('color', '#424ae0');

let bars = barChart
    .selectAll('.bar')
    .data(stats_data, theData => theData.value)
    .enter()
    .append('rect')
    .classed('bar', true)
    .attr('id', (theData) => theData.id)
    .attr('x', (theData) => x(theData.coinFace))
    .attr('y', 200)
    .attr('width', x.bandwidth());

bars
    .on('mouseover',(element)=>{
        let elementID = '#' + element.id
        d3.select(elementID).style('stroke', 'gray');
        d3.select(elementID).style('stroke-width', 3);

        toolTip
            .attr('transform', null)
            .attr('transform', `translate(${d3.select(elementID).attr('x')}, ${CHART_HEIGHT - (d3.select(elementID).attr('height') - ((CHART_HEIGHT - d3.select(elementID).attr('y')) / 2))})`);

        toolTip
            .select('#coinFace')
            .text(`${element.coinFace}: ${element.value}`);

        toolTip.select('#probability')
            .text(`${((element.value / (stats_data[0].value + stats_data[1].value)) * 100).toFixed(2)}%`)

        toolTip
            .transition()
            .duration(500)
            .attr('opacity', 1);

    })
    .on('mouseout',(element)=>{
        let elementID = '#' + element.id
        d3.select(elementID).style('stroke', null);
        d3.select('#tooltip').attr('opacity', 0);
        
    });

let toolTip = barChart
    .append('g')
    .attr('id', 'tooltip')
    .attr('transform', 'translate(50, 50)')
    .attr('opacity', 0);

toolTip
    .append("rect")
    .classed('toolTipBorder', true)
    .attr('width', 90)
    .attr('height', 50)
    .attr('fill', '#dee0e0')
    .attr('stroke', '#424ae0')
    .attr('stroke-width', '2px')
    .attr('transform', 'translate(-5, -20)')
    .attr('border-radius', '5px');

toolTip
    .append("text")
    .attr('id', 'coinFace')
    .style('font-size', '14')
    .text('CoinFace:')
    .attr('maxlength', '5');

toolTip
    .append("text")
    .attr('id', 'probability')
    .attr(`transform`, 'translate(0, 20)')
    .style('font-size', '14')
    .text('%')
    .attr('maxlength', '5');

flipButton.on("click", ()=>{
    let i = Math.floor(Math.random() * 2);
    if(i)
    {
        setTimeout(function(){
            coin.attr('style',  'animation: spin-heads 3s forwards');
        }, 100);
        stats_data[0].value++;
    }
    else
    {
        setTimeout(function(){
            coin.attr('style',  'animation: spin-tails 3s forwards');
    }, 100);
    stats_data[1].value++;
    }
    coin.attr('style', 'animation: none');

    setTimeout(renderStatsData, 3000);
    disableFlipButton();
});

resetButton.on("click", () =>{
    coin.attr('style', 'animation: none')
    coin.attr('transform', 'rotateX(0)');

    stats_data[0].value = 0;
    stats_data[1].value = 0;

    bars = barChart
        .selectAll('.bar')
        .attr('y', 200)
        .attr('height', 0);
})

function getStatsData()
{
    return stats_data;
}

function renderStatsData()
{
    bars
        .transition()
        .duration(500)
        .attr('y', (theData) => y(theData.value / (stats_data[0].value + stats_data[1].value)))
        .attr('height', (theData) => CHART_HEIGHT - y(theData.value / (stats_data[0].value + stats_data[1].value)));

}

function disableFlipButton()
{
    flipButton.attr('disabled', 'true');
    setTimeout(function(){
        flipButton.attr('disabled', null);
    }, 3000);
}

