// Cuando la página carga- ejecuta esta instruccion
document.addEventListener('DOMContentLoaded', async() => {
    await loadComponents(); //carga el header y footer

    document.querySelectorAll('.nav-link').forEach(
      link => link.href.endsWith(location.pathname.split('/').pop() || 'index.html') 
      && link.classList.add('active'));

    
    
    if (document.getElementById('history-container')) renderHistory();
    if (document.getElementById('players-container')) renderSquad();
    if (document.getElementById('partidos-container')) renderMatches();
    if (document.getElementById('stadium-container')) renderStadium();
    if (document.getElementById('home-container')) renderHome();

});


// Funcion para cargar HTMLs
async function loadComponents() {
    const loadHTML = async (elementId, filePath) => {
        const element = document.getElementById(elementId);
        const response = await fetch(filePath);
        element.innerHTML = await response.text();
    };

    await loadHTML('header-placeholder', 'components/header.html');
    await loadHTML('footer-placeholder', 'components/footer.html')
    
}

function renderHistory(){
    const element = document.getElementById('history-container');
    element.innerHTML = window.clubHistory.map(function(item) {
        let image = '';
        image = `<img src="${item.image}"
                class="img-fluid rounder mb-3 shadow-sm w-100"
                style="max-height:400px; object-fit:cover;">`;
        return `
            <div class="timeline-item">
                ${image}
                <div class="timeline-year">${item.year}</div>
                <h4 class="h4">${item.title}</h4>
                <p class="text-muted">${item.description}</p>
            </div>`;
    }).join('');

}
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("players-container");
    const players = window.FCBplayers;

    players.forEach(player => {
        container.innerHTML += `
            <div class="col-md-4 mb-4">
                <div class="card shadow">
                    <div class="card-body text-center">
                        <h5 class="card-title">${player.name}</h5>
                        <p class="card-text">${player.position}</p>
                    </div>
                </div>
            </div>
        `;
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('season-container');
    const data = window.seasonsData; // Accedemos al array del otro archivo

    if (!data || data.length === 0) {
        container.innerHTML = '<p class="text-muted">No hay datos disponibles.</p>';
        return;
    }

    data.forEach(temporada => {
        // Crear el título de la competición
        const section = document.createElement('div');
        section.className = 'mb-5';
        
        let html = `
            <h4 class="text-primary mb-3">${temporada.competition} - ${temporada.season}</h4>
            <div class="table-responsive">
                <table class="table table-hover align-middle">
                    <thead class="table-dark">
                        <tr>
                            <th>Jornada</th>
                            <th>Fecha</th>
                            <th class="text-end">Local</th>
                            <th class="text-center">Resultado</th>
                            <th>Visitante</th>
                            <th>Estadio</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        // Generar las filas de los partidos
        temporada.matches.forEach(match => {
            // Lógica simple para resaltar al Barça
            const isHomeBarca = match.home === "FC Barcelona";
            
            html += `
                <tr>
                    <td><span class="badge bg-secondary">${match.round}</span></td>
                    <td class="small">${new Date(match.date).toLocaleDateString()}</td>
                    <td class="text-end ${isHomeBarca ? 'fw-bold' : ''}">${match.home}</td>
                    <td class="text-center">
                        <span class="px-3 py-1 bg-light border rounded fw-bold">${match.result}</span>
                    </td>
                    <td class="${!isHomeBarca ? 'fw-bold' : ''}">${match.away}</td>
                    <td class="text-muted small">${match.stadium}</td>
                </tr>
            `;
        });

        html += `
                    </tbody>
                </table>
            </div>
        `;
        
        section.innerHTML = html;
        container.appendChild(section);
    });
});