document.addEventListener("DOMContentLoaded", () => {
  const storedData = JSON.parse(localStorage.getItem("formDataArray")) || [];

  // Function to get club popularity
  function getClubPopularity(data) {
    const clubs = [
      "Liverpool",
      "ManUnited",
      "RealMadrid",
      "Arsenal",
      "Barcelona",
    ];
    const popularity = clubs.map(
      (club) => data.filter((item) => item.club === club).length
    );
    return { clubs, popularity };
  }

  // Function to get loyalty scale
  function getLoyaltyScale(data) {
    const clubs = [
      "Liverpool",
      "ManUnited",
      "RealMadrid",
      "Arsenal",
      "Barcelona",
    ];
    const loyalty = clubs.map((club) => {
      const clubData = data.filter((item) => item.club === club);

      const totalLoyalty = clubData.reduce(
        (acc, item) => acc + parseFloat(item.range),
        0
      );
      console.log(totalLoyalty);
      return clubData.length ? totalLoyalty / clubData.length : 0;
    });
    return { clubs, loyalty };
  }

  // Function to get choice scale
  function getChoiceScale(data) {
    const choices = ["Goal at the +90", "Winning the Derby", "Winning a Cup"];
    const choiceCounts = choices.map(
      (choice) => data.filter((item) => item.choice === choice).length
    );
    return { choices, choiceCounts };
  }

  // Create Popularity Chart
  function createPopularityChart(data) {
    const svg = d3
      .select("#popularityChart")
      .append("svg")
      .attr("width", 500)
      .attr("height", 300);

    const x = d3
      .scaleLinear()
      .domain([0, d3.max(data.popularity)])
      .range([0, 500]);

    const y = d3.scaleBand().domain(data.clubs).range([0, 300]).padding(0.1);

    svg
      .selectAll("rect")
      .data(data.popularity)
      .enter()
      .append("rect")
      .attr("x", 0)
      .attr("y", (d, i) => y(data.clubs[i]))
      .attr("width", (d) => x(d))
      .attr("height", y.bandwidth())
      .attr("fill", "#2cbab2");

    svg
      .selectAll("text")
      .data(data.clubs)
      .enter()
      .append("text")
      .attr("x", 5)
      .attr("y", (d, i) => y(data.clubs[i]) + y.bandwidth() / 2)
      .attr("dy", "0.35em")
      .text((d) => d)
      .attr("fill", "black");
  }

  // Create Loyalty Gauges
  function createLoyaltyGauges(data) {
    const container = d3.select("#loyaltyGauges");

    data.clubs.forEach((club, index) => {
      const loyaltyScore = data.loyalty[index];

      const svg = container
        .append("svg")
        .attr("width", 150)
        .attr("height", 150)
        .attr("fill", "rgb(44, 186, 178)");
      const arc = d3
        .arc()
        .innerRadius(60)
        .outerRadius(70)
        .startAngle(0)
        .endAngle((loyaltyScore / 100) * 2 * Math.PI);
      // Append the gauge arc with color
      svg
        .append("path")
        .attr("d", arc)

        .attr("transform", `translate(75,75)`)
        .attr("fill", "rgb(44, 186, 178)");

      // Append the percentage text
      svg
        .append("text")
        .attr("x", 75)
        .attr("y", 75)
        .attr("dy", ".35em")
        .attr("font-weight", "bolder")
        .attr("text-anchor", "middle")
        .text(`${loyaltyScore.toFixed(2)}%`);

      // Append the club name
      svg
        .append("text")
        .attr("x", 75)
        .attr("y", 100)
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .text(club);
    });

    // Define the gradient
    container
      .append("defs")
      .append("linearGradient")
      .attr("id", "gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "0%")
      .selectAll("stop")
      .data([
        { offset: "0%", color: "red" },
        { offset: "50%", color: "yellow" },
        { offset: "100%", color: "green" },
      ])
      .enter()
      .append("stop")
      .attr("offset", (d) => d.offset)
      .attr("stop-color", (d) => d.color);
  }

  // Create Choice Chart
  function createChoiceChart(data) {
    const svg = d3
      .select("#choiceChart")
      .append("svg")
      .attr("width", 500)
      .attr("height", 325);

    const x = d3.scaleBand().domain(data.choices).range([0, 500]).padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data.choiceCounts)])
      .range([325, 0]);

    svg
      .selectAll("rect")
      .data(data.choiceCounts)
      .enter()
      .append("rect")
      .attr("x", (d, i) => x(data.choices[i]))
      .attr("y", (d) => y(d))
      .attr("width", x.bandwidth())

      .attr("height", (d) => 325 - y(d))
      .attr("fill", "#2cbab2");

    svg
      .selectAll(".choice-label")
      .data(data.choices)
      .enter()
      .append("text")
      .attr("class", "choice-label")
      .attr("x", (d, i) => x(data.choices[i]) + x.bandwidth() / 2)
      .attr("y", 315)
      .attr("text-anchor", "middle")
      .attr("fill", "aliceblue")

      .text((d) => d);
  }

  // Call chart functions
  const popularityData = getClubPopularity(storedData);
  const loyaltyData = getLoyaltyScale(storedData);
  const choiceData = getChoiceScale(storedData);

  createPopularityChart(popularityData);
  createLoyaltyGauges(loyaltyData);
  createChoiceChart(choiceData);
});
