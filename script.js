// =================================================
// PALHOÇA HERO
// SCRIPT.JS - PARTE 1
// =================================================

// =================================================
// CONFIGURAÇÕES
// =================================================

const APP = {

    VERSION: "1.0",

    XP_PER_REPORT: 50,

    MAX_XP_BAR: 5000

};

// =================================================
// ELEMENTOS
// =================================================

const notification =
    document.getElementById(
        "notification"
    );

const xpProgress =
    document.getElementById(
        "xp-progress"
    );

const xpText =
    document.getElementById(
        "xp-text"
    );

const playerRank =
    document.getElementById(
        "player-rank"
    );

const totalXP =
    document.getElementById(
        "total-xp"
    );

const totalReports =
    document.getElementById(
        "total-reports"
    );

const totalAchievements =
    document.getElementById(
        "total-achievements"
    );

const achievementFeed =
    document.getElementById(
        "achievement-feed"
    );

const activityFeed =
    document.getElementById(
        "activity-feed"
    );

// =================================================
// DADOS SALVOS
// =================================================

let playerXP =
    Number(
        localStorage.getItem(
            "playerXP"
        )
    ) || 0;

let reports =
    JSON.parse(
        localStorage.getItem(
            "reports"
        )
    ) || [];

let achievements =
    JSON.parse(
        localStorage.getItem(
            "achievements"
        )
    ) || [];

let missions =
    JSON.parse(
        localStorage.getItem(
            "missions"
        )
    ) || {

        lixo:0,

        buraco:0,

        arvore:0,

        alagamento:0,

        animal:0,

        iluminacao:0

    };

// =================================================
// PATENTES
// =================================================

const ranks = [

    {
        name:"Civil",
        xp:0
    },

    {
        name:"Recruta",
        xp:100
    },

    {
        name:"Cabo",
        xp:300
    },

    {
        name:"Sargento",
        xp:600
    },

    {
        name:"Tenente",
        xp:1000
    },

    {
        name:"Capitão",
        xp:2000
    },

    {
        name:"Coronel",
        xp:5000
    }

];

// =================================================
// LOADING
// =================================================

window.addEventListener(
    "load",
    () => {

        setTimeout(() => {

            document.getElementById(
                "loading-screen"
            ).style.display =
                "none";

        }, 1500);

    }
);

// =================================================
// NOTIFICAÇÕES
// =================================================

function showNotification(
    message
){

    notification.textContent =
        message;

    notification.classList.add(
        "show"
    );

    setTimeout(() => {

        notification.classList.remove(
            "show"
        );

    }, 3000);

}

// =================================================
// XP
// =================================================

function updateXP(){

    const percentage =

        (playerXP /
        APP.MAX_XP_BAR)

        * 100;

    xpProgress.style.width =
        percentage + "%";

    xpText.textContent =
        `${playerXP} XP`;

    totalXP.textContent =
        playerXP;

    updateRank();

}

// =================================================
// PATENTE
// =================================================

function updateRank(){

    let currentRank =
        "Civil";

    for(
        let rank
        of ranks
    ){

        if(
            playerXP >= rank.xp
        ){

            currentRank =
                rank.name;

        }

    }

    playerRank.textContent =
        currentRank;

}

// =================================================
// ADICIONAR XP
// =================================================

function addXP(amount){

    playerXP += amount;

    localStorage.setItem(

        "playerXP",

        playerXP

    );

    updateXP();

    showNotification(
        `+${amount} XP`
    );

}

// =================================================
// CONQUISTAS
// =================================================

function unlockAchievement(
    achievementName
){

    if(

        achievements.includes(
            achievementName
        )

    ){

        return;

    }

    achievements.push(
        achievementName
    );

    localStorage.setItem(

        "achievements",

        JSON.stringify(
            achievements
        )

    );

    totalAchievements.textContent =

        achievements.length;

    achievementFeed.innerHTML =

        achievementName;

    showNotification(
        `🏆 ${achievementName}`
    );

}

// =================================================
// MISSÕES
// =================================================

function checkMissions(type){

    if(

        missions[type]
        !== undefined

    ){

        missions[type]++;

    }

    localStorage.setItem(

        "missions",

        JSON.stringify(
            missions
        )

    );

    // Operação Cidade Limpa

    if(
        missions.lixo >= 3
    ){

        unlockAchievement(
            "Operação Cidade Limpa"
        );

        addXP(200);

        missions.lixo =
            -999;

    }

    // Caçador de Buracos

    if(
        missions.buraco >= 5
    ){

        unlockAchievement(
            "Caçador de Buracos"
        );

        addXP(300);

        missions.buraco =
            -999;

    }

    // Guardião Verde

    if(
        missions.arvore >= 3
    ){

        unlockAchievement(
            "Guardião Verde"
        );

        addXP(250);

        missions.arvore =
            -999;

    }

}

// =================================================
// SCRIPT.JS - PARTE 2
// MAPA + OCORRÊNCIAS
// =================================================

// =================================================
// MAPA DE PALHOÇA
// =================================================

const map = L.map("map").setView(

    [-27.6455, -48.6697],

    13

);

L.tileLayer(

    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

    {

        attribution:

        "&copy; OpenStreetMap"

    }

).addTo(map);

// =================================================
// MARCADOR CENTRO
// =================================================

L.marker(

    [-27.6455, -48.6697]

)

.addTo(map)

.bindPopup(

    "<b>Palhoça Hero</b><br>Centro de Palhoça"

);

// =================================================
// CORES DOS MARCADORES
// =================================================

function getMarkerColor(type){

    switch(type){

        case "lixo":

            return "green";

        case "buraco":

            return "black";

        case "arvore":

            return "darkgreen";

        case "alagamento":

            return "blue";

        case "animal":

            return "orange";

        case "iluminacao":

            return "yellow";

        default:

            return "red";

    }

}

// =================================================
// CRIAR ÍCONE
// =================================================

function createCustomIcon(type){

    const color =

        getMarkerColor(type);

    return L.divIcon({

        html: `

            <div style="

                width:20px;

                height:20px;

                border-radius:50%;

                background:${color};

                border:3px solid white;

                box-shadow:0 0 10px rgba(0,0,0,.5);

            "></div>

        `,

        className:""

    });

}

// =================================================
// DESENHAR OCORRÊNCIA
// =================================================

function drawReport(report){

    const marker =

        L.marker(

            [

                report.lat,

                report.lng

            ],

            {

                icon:

                createCustomIcon(

                    report.type

                )

            }

        )

        .addTo(map);

    marker.bindPopup(`

        <b>Tipo:</b>

        ${report.type}

        <br><br>

        <b>Descrição:</b>

        ${report.description}

    `);

}

// =================================================
// CARREGAR OCORRÊNCIAS
// =================================================

function loadReports(){

    reports.forEach(report => {

        drawReport(report);

    });

}

// =================================================
// ESTATÍSTICAS
// =================================================

function updateStats(){

    totalReports.textContent =

        reports.length;

    totalAchievements.textContent =

        achievements.length;

}

// =================================================
// FEED
// =================================================

function addActivity(message){

    activityFeed.innerHTML =

        message;

}

// =================================================
// CARREGAMENTO INICIAL
// =================================================

loadReports();

updateStats();

updateXP();

// =================================================
// SCRIPT.JS - PARTE 3
// MODAL + DENÚNCIAS + UPLOAD
// =================================================

// =================================================
// ELEMENTOS DO MODAL
// =================================================

const reportModal =
    document.getElementById(
        "report-modal"
    );

const reportForm =
    document.getElementById(
        "report-form"
    );

const reportImage =
    document.getElementById(
        "report-image"
    );

const imagePreview =
    document.getElementById(
        "image-preview"
    );

// =================================================
// COORDENADAS CLICADAS
// =================================================

let clickedLat = null;

let clickedLng = null;

// =================================================
// ABRIR MODAL AO CLICAR NO MAPA
// =================================================

map.on("click", e => {

    clickedLat =
        e.latlng.lat;

    clickedLng =
        e.latlng.lng;

    reportModal.style.display =
        "flex";

});

// =================================================
// FECHAR MODAL
// =================================================

window.addEventListener(
    "click",
    e => {

        if(
            e.target ===
            reportModal
        ){

            reportModal.style.display =
                "none";

        }

    }
);

// =================================================
// PREVIEW DA IMAGEM
// =================================================

reportImage.addEventListener(
    "change",
    e => {

        const file =
            e.target.files[0];

        if(!file){

            return;

        }

        const reader =
            new FileReader();

        reader.onload =
            event => {

            imagePreview.src =

                event.target.result;

            imagePreview.style.display =

                "block";

        };

        reader.readAsDataURL(
            file
        );

    }
);

// =================================================
// REGISTRAR OCORRÊNCIA
// =================================================

reportForm.addEventListener(

    "submit",

    e => {

        e.preventDefault();

        const type =

            document.getElementById(
                "report-type"
            ).value;

        const description =

            document.getElementById(
                "report-description"
            ).value;

        const report = {

            id: Date.now(),

            type,

            description,

            lat: clickedLat,

            lng: clickedLng,

            date:

            new Date()
            .toLocaleString(
                "pt-BR"
            ),

            status:"Pendente",

        };

        reports.push(
            report
        );

        localStorage.setItem(

            "reports",

            JSON.stringify(
                reports
            )

        );

        drawReport(
            report
        );

        addXP(
            APP.XP_PER_REPORT
        );

        checkMissions(
            type
        );

        updateStats();

        addActivity(

            `Nova ocorrência registrada: ${type}`

        );

        reportModal.style.display =

            "none";

        reportForm.reset();

        imagePreview.style.display =

            "none";

    }

);

// =================================================
// ATUALIZAÇÃO INICIAL
// =================================================

updateXP();

updateStats();

if(

    achievements.length > 0

){

    achievementFeed.innerHTML =

        achievements[
            achievements.length - 1
        ];

}

// =================================================
// MENSAGEM DE BOAS-VINDAS
// =================================================

setTimeout(() => {

    showNotification(

        "Bem-vindo ao Palhoça Hero"

    );

}, 2000);

// =================================================
// FIM DO SCRIPT
// =================================================

// =================================================
// SCRIPT.JS - PARTE 4
// TUTORIAL + LOCALIZAÇÃO + TEMA
// =================================================

// =================================================
// CRIAR HTML DO TUTORIAL
// =================================================

const tutorialHTML = `

<div id="tutorial-overlay">

    <div class="tutorial-box">

        <div class="tutorial-header">

            <i class="fa-solid fa-user-shield"></i>

            <span>
                Comandante Silva
            </span>

        </div>

        <div class="tutorial-body">

            <h2 id="tutorial-title">

                Bem-vindo Agente

            </h2>

            <p id="tutorial-text">

                Sua missão é ajudar a cidade.

            </p>

        </div>

        <div class="tutorial-footer">

            <button
                id="tutorial-next"
                class="tutorial-btn">

                Próximo

            </button>

        </div>

    </div>

</div>

`;

document.body.insertAdjacentHTML(
    "beforeend",
    tutorialHTML
);

// =================================================
// PASSOS DO TUTORIAL
// =================================================

const tutorialSteps = [

    {

        title:
        "Bem-vindo ao Palhoça Hero",

        text:
        "Você foi recrutado para ajudar a cidade reportando problemas urbanos."

    },

    {

        title:
        "Como denunciar",

        text:
        "Clique em qualquer ponto do mapa para registrar uma ocorrência."

    },

    {

        title:
        "Ganhe XP",

        text:
        "Cada denúncia gera experiência e aumenta sua patente."

    },

    {

        title:
        "Missões",

        text:
        "Complete missões para ganhar recompensas extras."

    },

    {

        title:
        "Boa sorte Agente",

        text:
        "A cidade conta com você."

    }

];

let tutorialIndex = 0;

const tutorialOverlay =
    document.getElementById(
        "tutorial-overlay"
    );

const tutorialTitle =
    document.getElementById(
        "tutorial-title"
    );

const tutorialText =
    document.getElementById(
        "tutorial-text"
    );

const tutorialNext =
    document.getElementById(
        "tutorial-next"
    );

// =================================================
// MOSTRAR TUTORIAL
// =================================================

function showTutorialStep(){

    tutorialTitle.textContent =

        tutorialSteps[
            tutorialIndex
        ].title;

    tutorialText.textContent =

        tutorialSteps[
            tutorialIndex
        ].text;

}

if(

    !localStorage.getItem(
        "tutorialCompleted"
    )

){

    tutorialOverlay.style.display =
        "flex";

    showTutorialStep();

}

tutorialNext.addEventListener(
    "click",
    () => {

        tutorialIndex++;

        if(

            tutorialIndex >=
            tutorialSteps.length

        ){

            tutorialOverlay.style.display =
                "none";

            localStorage.setItem(

                "tutorialCompleted",

                "true"

            );

            return;

        }

        showTutorialStep();

    }
);

// =================================================
// LOCALIZAÇÃO DO USUÁRIO
// =================================================

if(

    navigator.geolocation

){

    navigator.geolocation.getCurrentPosition(

        position => {

            const lat =
                position.coords.latitude;

            const lng =
                position.coords.longitude;

            const userIcon =
                L.divIcon({

                html: `
                    <div
                    class="user-location-marker">
                    </div>
                `,

                className:""

            });

            L.marker(

                [lat,lng],

                {
                    icon:userIcon
                }

            )

            .addTo(map)

            .bindPopup(

                "📍 Você está aqui"

            );

        },

        error => {

            console.log(

                "Localização não permitida"

            );

        }

    );

}

// =================================================
// BOTÃO DE TEMA
// =================================================

const themeButton =

`

<button
id="theme-toggle"
class="theme-toggle">

    <i class="fa-solid fa-moon"></i>

</button>

`;

document.body.insertAdjacentHTML(

    "beforeend",

    themeButton

);

const themeToggle =

document.getElementById(
    "theme-toggle"
);

// =================================================
// TEMA SALVO
// =================================================

const savedTheme =

localStorage.getItem(
    "theme"
);

if(

    savedTheme ===
    "cyberpunk"

){

    document.body.classList.add(
        "cyberpunk"
    );

}

// =================================================
// TROCAR TEMA
// =================================================

themeToggle.addEventListener(

    "click",

    () => {

        document.body.classList.toggle(
            "cyberpunk"
        );

        if(

            document.body.classList.contains(
                "cyberpunk"
            )

        ){

            localStorage.setItem(

                "theme",

                "cyberpunk"

            );

            showNotification(
                "Modo Cyberpunk"
            );

        }

        else{

            localStorage.setItem(

                "theme",

                "default"

            );

            showNotification(
                "Modo Padrão"
            );

        }

    }

);

// =================================================
// FIM PARTE 4
// =================================================
// =================================================
// SCRIPT.JS - PARTE 5
// MISSÕES ESPECIAIS
// =================================================

const specialMissions = [

    {
        id:"centro",
        name:"Centro de Palhoça",
        xp:100,
        lat:-27.6455,
        lng:-48.6697
    },

    {
        id:"pedra_branca",
        name:"Pedra Branca",
        xp:150,
        lat:-27.6769,
        lng:-48.6765
    },

    {
        id:"pagani",
        name:"Pagani",
        xp:120,
        lat:-27.6598,
        lng:-48.6795
    },

    {
        id:"guarda",
        name:"Guarda do Embaú",
        xp:250,
        lat:-27.9030,
        lng:-48.6260
    }

];

let completedSpecialMissions =

JSON.parse(

    localStorage.getItem(
        "completedSpecialMissions"
    )

) || [];

// =================================================
// CRIAR MISSÕES
// =================================================

specialMissions.forEach(mission => {

    const missionIcon =

        L.divIcon({

            html:`

            <div
            class="mission-marker">
            </div>

            `,

            className:""

        });

    const marker =

        L.marker(

            [
                mission.lat,
                mission.lng
            ],

            {
                icon:missionIcon
            }

        )

        .addTo(map);

    marker.bindPopup(

        `
        🏆 <b>${mission.name}</b>

        <br><br>

        Recompensa:
        ${mission.xp} XP

        <br><br>

        Clique para descobrir.
        `
    );

    marker.on(

        "click",

        () => {

            if(

                completedSpecialMissions.includes(
                    mission.id
                )

            ){

                showNotification(
                    "Missão já concluída"
                );

                return;

            }

            completedSpecialMissions.push(
                mission.id
            );

            localStorage.setItem(

                "completedSpecialMissions",

                JSON.stringify(
                    completedSpecialMissions
                )

            );

            addXP(
                mission.xp
            );

            unlockAchievement(

                "Explorador: " +
                mission.name

            );

            addActivity(

                "Missão descoberta: " +
                mission.name

            );

            showNotification(

                `🏆 +${mission.xp} XP`

            );

        }

    );

});

// =================================================
// SCRIPT.JS - PARTE 6
// LOGIN DO AGENTE
// =================================================

const loginHTML = `

<div id="agent-login">

    <div class="agent-box">

        <h2>

            Bem-vindo ao Palhoça Hero

        </h2>

        <input
            id="agent-name-input"
            placeholder="Digite seu nome de agente">

        <button id="agent-save">

            Entrar

        </button>

    </div>

</div>

`;

document.body.insertAdjacentHTML(
    "beforeend",
    loginHTML
);

const loginScreen =

document.getElementById(
    "agent-login"
);

const playerNameElement =

document.getElementById(
    "player-name"
);

const savedAgent =

localStorage.getItem(
    "agentName"
);

// =================================================
// PRIMEIRO ACESSO
// =================================================

if(!savedAgent){

    loginScreen.style.display =
        "flex";

}
else{

    playerNameElement.textContent =
        savedAgent;

}

// =================================================
// BOTÃO ENTRAR
// =================================================

document
.getElementById(
    "agent-save"
)
.addEventListener(

    "click",

    () => {

        const name =

        document
        .getElementById(
            "agent-name-input"
        )
        .value
        .trim();

        if(name.length < 3){

            alert(
                "Digite um nome válido."
            );

            return;

        }

        localStorage.setItem(

            "agentName",

            name

        );

        playerNameElement.textContent =
            name;

        loginScreen.style.display =
            "none";

        showNotification(

            "Bem-vindo Agente " +
            name

        );

    }

);

// =================================================
// SCRIPT.JS - PARTE 7
// RANKING
// =================================================

const panelHTML = `

<div id="game-panel">

    <span
    id="close-panel"
    class="panel-close">

        ✖

    </span>

    <div id="panel-content">

    </div>

</div>

`;

document.body.insertAdjacentHTML(

    "beforeend",

    panelHTML

);

const gamePanel =

document.getElementById(
    "game-panel"
);

const panelContent =

document.getElementById(
    "panel-content"
);

// =================================================
// RANKING
// =================================================

function openRanking(){

    const playerName =

        localStorage.getItem(
            "agentName"
        ) || "Você";

    const ranking = [

        {
            nome:playerName,
            xp:playerXP
        },

        {
            nome:"João",
            xp:1200
        },

        {
            nome:"Maria",
            xp:950
        },

        {
            nome:"Carlos",
            xp:600
        }

    ];

    ranking.sort(

        (a,b)=>

        b.xp-a.xp

    );

    let html =

    `<h2>🏆 Ranking</h2>`;

    ranking.forEach(

        (player,index)=>{

        html += `

        <div class="ranking-row">

            <span>

                ${index+1}º

                ${player.nome}

            </span>

            <span>

                ${player.xp} XP

            </span>

        </div>

        `;

    });

    panelContent.innerHTML =
        html;

    gamePanel.style.display =
        "block";

}

// =================================================
// BOTÃO RANKING
// =================================================

const rankingButton =

document.querySelectorAll(
    ".menu-btn"
)[3];

rankingButton.addEventListener(

    "click",

    openRanking

);

// =================================================
// FECHAR
// =================================================

document
.getElementById(
    "close-panel"
)
.addEventListener(

    "click",

    ()=>{

        gamePanel.style.display =
            "none";

    }

);

// =================================================
// SCRIPT.JS - PARTE 8
// DASHBOARD
// =================================================

function openDashboard(){

    const playerName =

        localStorage.getItem(
            "agentName"
        ) || "Agente";

    const currentRank =

        playerRank.textContent;

    const reportsCount =

        reports.length;

    const achievementsCount =

        achievements.length;

    const specialCount =

        completedSpecialMissions
        ? completedSpecialMissions.length
        : 0;

    panelContent.innerHTML = `

        <h2>

            📊 Dashboard

        </h2>

        <div class="ranking-row">

            <span>
                Agente
            </span>

            <span>
                ${playerName}
            </span>

        </div>

        <div class="ranking-row">

            <span>
                Patente
            </span>

            <span>
                ${currentRank}
            </span>

        </div>

        <div class="ranking-row">

            <span>
                XP
            </span>

            <span>
                ${playerXP}
            </span>

        </div>

        <div class="ranking-row">

            <span>
                Denúncias
            </span>

            <span>
                ${reportsCount}
            </span>

        </div>

        <div class="ranking-row">

            <span>
                Conquistas
            </span>

            <span>
                ${achievementsCount}
            </span>

        </div>

        <div class="ranking-row">

            <span>
                Missões Especiais
            </span>

            <span>
                ${specialCount}
            </span>

        </div>

    `;

    gamePanel.style.display =
        "block";

}

// =================================================
// BOTÃO DASHBOARD
// =================================================

const dashboardButton =

document.querySelectorAll(
    ".menu-btn"
)[0];

dashboardButton.addEventListener(

    "click",

    openDashboard

);


// =================================================
// SCRIPT.JS - PARTE 9
// CONQUISTAS
// =================================================

function openAchievements(){

    let html = `

        <h2>

            🏆 Conquistas

        </h2>

    `;

    if(

        achievements.length === 0

    ){

        html += `

        <div class="ranking-row">

            <span>

                Nenhuma conquista desbloqueada.

            </span>

        </div>

        `;

    }

    achievements.forEach(

        achievement => {

            html += `

            <div class="ranking-row">

                <span>

                    🏆 ${achievement}

                </span>

            </div>

            `;

        }

    );

    panelContent.innerHTML =

        html;

    gamePanel.style.display =

        "block";

}

// =================================================
// BOTÃO CONQUISTAS
// =================================================

const achievementsButton =

document.querySelectorAll(
    ".menu-btn"
)[2];

achievementsButton.addEventListener(

    "click",

    openAchievements

);

// =================================================
// SCRIPT.JS - PARTE 10
// MISSÕES
// =================================================

function openMissions(){

    const lixoAtual =

        missions.lixo < 0
        ? 3
        : missions.lixo;

    const buracoAtual =

        missions.buraco < 0
        ? 5
        : missions.buraco;

    const arvoreAtual =

        missions.arvore < 0
        ? 3
        : missions.arvore;

    panelContent.innerHTML = `

        <h2>

            🎯 Missões

        </h2>

        <div class="ranking-row">

            <span>

                Operação Cidade Limpa

            </span>

            <span>

                ${lixoAtual}/3

            </span>

        </div>

        <div class="ranking-row">

            <span>

                Caçador de Buracos

            </span>

            <span>

                ${buracoAtual}/5

            </span>

        </div>

        <div class="ranking-row">

            <span>

                Guardião Verde

            </span>

            <span>

                ${arvoreAtual}/3

            </span>

        </div>

    `;

    gamePanel.style.display =
        "block";

}

// =================================================
// BOTÃO MISSÕES
// =================================================

const missionsButton =

document.querySelectorAll(
    ".menu-btn"
)[1];

missionsButton.addEventListener(

    "click",

    openMissions

);

// =================================================
// SCRIPT.JS - PARTE 11
// OCORRÊNCIAS
// =================================================

function openReports(){

    let html = `

        <h2>

            📋 Ocorrências

        </h2>

    `;

    if(

        reports.length === 0

    ){

        html += `

        <div class="ranking-row">

            <span>

                Nenhuma ocorrência registrada.

            </span>

        </div>

        `;

    }

    reports
    .slice()
    .reverse()
    .forEach(report => {

        html += `

        <div class="ranking-row">

            <span>

                ${getReportIcon(
                    report.type
                )}

                ${report.type}
                
                <br>

                ${getStatusIcon(

                report.status

                )}



                ${report.status}    

            </span>

            <span>

                ${report.date
                    || "Sem data"}

            </span>

        </div>

        `;

    });

    panelContent.innerHTML =

        html;

    gamePanel.style.display =

        "block";

}

// =================================================
// ÍCONES
// =================================================

function getReportIcon(type){

    switch(type){

        case "lixo":
            return "🗑️";

        case "buraco":
            return "🕳️";

        case "arvore":
            return "🌳";

        case "alagamento":
            return "🌊";

        case "animal":
            return "🐶";

        case "iluminacao":
            return "💡";

        default:
            return "📍";

    }

}

// =================================================
// BOTÃO OCORRÊNCIAS
// =================================================

const reportsButton =

document.querySelectorAll(
    ".menu-btn"
)[4];

reportsButton.addEventListener(

    "click",

    openReports

);

// =================================================
// V3 PARTE 1
// HERO SCREEN
// =================================================

const heroHTML = `

<div id="hero-screen">

    <div class="hero-box">

        <div class="hero-logo">

            🛡️

        </div>

        <div class="hero-title">

            PALHOÇA HERO

        </div>

        <div class="hero-subtitle">

            Transformando cidadãos
            em heróis urbanos

        </div>

        <button
        id="start-hero"

        class="hero-button">

            🚀 INICIAR MISSÃO

        </button>

    </div>

</div>

`;

document.body.insertAdjacentHTML(

    "beforeend",

    heroHTML

);

// =================================================
// ENTRAR
// =================================================

document
.getElementById(
    "start-hero"
)
.addEventListener(

    "click",

    () => {

        document
        .getElementById(
            "hero-screen"
        )
        .remove();

    }

);

// =================================================
// V3.4
// STATUS DAS OCORRÊNCIAS
// =================================================

function getStatusIcon(status){

    switch(status){

        case "Pendente":

            return "🔴";

        case "Em Análise":

            return "🟡";

        case "Resolvido":

            return "🟢";

        default:

            return "⚪";

    }

}

// =================================================
// CORRIGIR OCORRÊNCIAS ANTIGAS
// =================================================

reports.forEach(report => {

    if(!report.status){

        report.status =

            "Pendente";

    }

});

localStorage.setItem(

    "reports",

    JSON.stringify(
        reports
    )

);