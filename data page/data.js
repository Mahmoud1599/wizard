document.addEventListener("DOMContentLoaded", () => {
  const storedData = JSON.parse(localStorage.getItem("formDataArray")) || [];

  const clubFilter = document.getElementById("club-filter");
  const searchInput = document.getElementById("search");
  const dataTable = document
    .getElementById("data-table")
    .querySelector("tbody");
  const clubHeader = document.getElementById("club-header");

  function displayData(data) {
    dataTable.innerHTML = "";

    data.forEach((item) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.title}</td>
        <td class="club-col">${item.club}</td>
        <td>${item.range}%</td>
        <td>${item.language}</td>
        <td>${item.description}</td>
      `;
      dataTable.appendChild(row);
    });

    const showClubColumn = clubFilter.value === "all";
    clubHeader.style.display = showClubColumn ? "table-cell" : "none";
    document.querySelectorAll(".club-col").forEach((col) => {
      col.style.display = showClubColumn ? "table-cell" : "none";
    });
  }

  function filterData() {
    const club = clubFilter.value;
    const searchQuery = searchInput.value.toLowerCase();

    const filteredData = storedData.filter((item) => {
      const matchesClub = club === "all" || item.club === club;
      const matchesSearch = item.title.toLowerCase().includes(searchQuery);
      return matchesClub && matchesSearch;
    });

    displayData(filteredData);
  }

  clubFilter.addEventListener("change", filterData);
  searchInput.addEventListener("input", filterData);

  displayData(storedData);
});
