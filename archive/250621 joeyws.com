<!DOCTYPE html>
<!-- █████ █████ █████ ██ ██ █ █ █ █████    █████ █████ ██ ██    
     █████ █████ ████  █████ █████ ████     █████ █████ █████    
      ████ ██ ██ █████ █████ █████ █████    ████  ██ ██ █████    
     █████ █████ ████   ████ █████  ████    █████ █████ █████    
     █████ █████ █████ █████ ██ ██ █████ ██ █████ █████ █ █ █ -->
<html lang="en" translate="no"><head>
<title>Joey W. Schweickhardt</title>
<link rel="shortcut icon" type="image/x-icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='32' width='32'%3E%3Ccircle cx='16' cy='16' r='14' fill='%23000000' /%3E%3C/svg%3E">
<meta charset="utf-8"><meta name="robots" content="index,nofollow,notranslate,noimageindex"><meta name="description" content="Welcome to the personal web page of Joey Schweickhardt."><meta name="keywords" content="joey,schweickhardt,stuttgart,architektur,architekt"><meta name="geo.region" content="DE-BW"><meta name="geo.placename" content="Stuttgart"><meta name="geo.position" content="48.778600;9.179746"><meta name="ICBM" content="48.778600, 9.179746"><meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=yes,shrink-to-fit=no"><meta name="format-detection" content="telephone=no">
<style>
    @font-face{font-family:webfont;src:url("font/SourceCodePro-Regular.ttf");font-display:swap;}
    :root{--background:#eee;--text:#111;--spacer:8px;}
    ::-moz-selection{background:var(--text);color:var(--background);}
    ::selection{background:var(--text);color:var(--background);}
    /* RESET */*{/* user-select:none; */text-decoration-thickness:1px;text-underline-offset:2px;text-decoration-skip-ink:none;font-kerning:normal;outline:none;-webkit-tap-highlight-color:rgba(0,0,0,0)!important;}html{height:100%;}html,body,div,span,applet,object,iframe,h1,h2,h3,h4,h5,h6,p,hr,blockquote,pre,a,abbr,acronym,address,big,cite,code,del,dfn,em,input,textarea,img,ins,kbd,q,s,samp,small,strike,strong,sub,sup,tt,var,b,u,i,center,dl,dt,dd,ol,ul,li,fieldset,form,label,legend,table,caption,tbody,tfoot,thead,tr,th,td,article,aside,canvas,details,embed,figure,figcaption,footer,header,hgroup,menu,nav,output,ruby,section,summary,time,mark,audio,video,progress{margin:0;padding:0;border:0;font-size:100%;font:inherit;letter-spacing:inherit;color:inherit;text-indent:0;vertical-align:baseline;background:transparent;}body{line-height:1;}table{border-collapse:collapse;border-spacing:0;}caption,th,td{text-align:left;font-weight:normal;vertical-align:middle;}q,blockquote{quotes:none;}q:before,q:after,blockquote:before,blockquote:after{content:"";}article,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,section,summary{display:block;}*{-webkit-tap-highlight-color:rgba(0,0,0,0);-webkit-text-size-adjust:none;-webkit-appearance:none;border-radius:0;-webkit-border-radius:0;box-sizing:content-box;font-smoothing:antialiased;-moz-osx-font-smoothing: grayscale;-moz-font-smoothing:antialiased;-webkit-font-smoothing:antialiased;}
	html{font-size:13px;background:var(--text);}
    body{color:var(--text);background:var(--background);min-height:100vh;font:normal normal 1rem/1.2em webfont,monospace;letter-spacing:.01em;/* background:url(archive/bg60.png) center center repeat fixed,url(img/other/bg_symmetryinchaos.webp) center center no-repeat fixed;background-size:auto,cover; *//* background:url(img/noise.png) center center repeat fixed,url(img/bg_bw.png) center center repeat fixed;background-size:200px,cover; */}
    h1{display:inline-block;/* font:normal normal 3.6rem/1em webfont2; */}
    p,.p,ul,table,#map{margin-top:var(--spacer);}
    hr+*,img+p,.content *:first-child{margin-top:0;}
    ul{list-style-type:none;list-style-position:inside;}
    table,tr,td{vertical-align:top;}
    table{width:100%;}
    tr{border-top:1px solid var(--text);}
    td:first-child{white-space:nowrap;width:140px;}
    td:not(:last-child){padding-right:calc(2* var(--spacer));}
    small,i{font-style:italic;}
    a{text-decoration:none;white-space:nowrap;/* text-decoration-style:dotted; */}
    a,.gallery div span span{text-decoration:underline;/* text-decoration-style:dotted; */text-underline-offset:2px;/* color:#00f; *//* transition:all .15s;box-shadow:inset 0 -.05em #aaa; */}
    a:hover,.gallery div:hover span span,.gallery div.show span span{text-decoration:none;/* color:var(--background); *//* box-shadow:inset 0 -1.25rem #ccc; *//* box-shadow:inset 0 -.05rem var(--text); */}
    /* LAYOUT */
    /* #header,.marquee3k,p,.video:after,.gallery div span span{mix-blend-mode:exclusion;} */
    #header{padding:var(--spacer);padding-bottom:0;gap:var(--spacer) calc(var(--spacer)*4);z-index:999996;display:flex;flex-wrap:wrap;justify-content:space-between;}
    #header>*{display:inline-block;white-space:nowrap;}
    .marquee3k{background:#0f0;padding:0;/* mask-mode:alpha;mask-image:linear-gradient(to right, transparent, #000 25%, #000 calc(100% - 25%), transparent);position:relative; *//* width:200px;flex-grow:1; */white-space:nowrap;overflow:hidden;}
    .marquee3k .marquee span:after{margin:0 .8em;content:"";}
    .loading{animation:.3s blink steps(1) infinite;}
    #nav{display:inline-block;}
    #nav a,#nav a:hover{text-decoration:none;background:#ccc;color:var(--text);border-radius:100vmax;padding:1px 7px;box-shadow:none !important;}
    #nav a.open{background:var(--text);color:var(--background);}
    #time-blink{animation:2s blink steps(1) infinite;}
    hr{margin:2.5rem 0;}
    .content{width:100%;padding:var(--spacer);padding-top:0;box-sizing:border-box;}
    .content:not(.show){display:none;}
    /* VIDEO */
    .video{cursor:pointer;overflow:hidden;position:relative;max-width:760px;/* font-size:0;line-height:0; */}
    .video:after{border:0 solid transparent;border-width:8px 22px;border-left-color:var(--text);border-right:0;line-height:0;font-size:0;content:"";display:inline-block;position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);pointer-events:none;}
    .video.playing{cursor:pointer;}
    .video.playing:after{display:none;}
    video{width:100%;cursor:pointer;max-width:760px;}
    /* GALLERY */
    .gallery{justify-content:space-evenly;grid-template-columns:repeat(auto-fit,220px);display:grid;line-height:0;font-size:0;}
    .gallery div{padding-top:calc(var(--spacer)*2);cursor:zoom-in;display:flex;align-items:center;justify-content:center;flex-direction:column;}
    .gallery div img{max-height:200px;max-width:200px;transition:all .1s ease-out;}
    .gallery div:hover img,.gallery div.show img{transform:translateY(-5px);}
    .gallery div span{width:200px;font-size:1rem;line-height:1.2em;min-height:calc(4*1.2rem);text-align:center;margin-top:var(--spacer);margin-top:var(--spacer);overflow:hidden;}
    /* SPECIAL */
    #lightbox{z-index:999997;cursor:zoom-out;position:fixed;inset:0;display:none;}
    #lightbox img{cursor:pointer;max-height:90vh;max-width:calc(100vw - 2*var(--spacer));box-sizing:border-box;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);}
    #map{width:760px;max-width:100%;aspect-ratio:1500/750;background:center center url(img/other/world.gif) no-repeat scroll;position:relative;background-size:contain;}
    #map:after{top:23%;left:52.5%;outline:1px solid #0f0;background:#0f0;animation:position 1.2s infinite ease-out;width:7px;height:7px;border-radius:100vmax;pointer-events:none;position:absolute;transform:translate(-50%,-50%);display:block;content:"";}
    @keyframes blink{0%{color:transparent;}50%{color:inherit;}}
    @keyframes position{100%{outline-color:transparent;outline-offset:20px;}}
    /* .marquee3k,#header,p,.gallery div span{mix-blend-mode:difference;} */
    /* *{cursor:url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" x="0px" y="0px" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" fill="%23f00" stroke="%23000" stroke-width="0"/></svg>') 8 8, auto !important;} */
</style>
</head>
<body>


<div class="marquee3k" data-speed=".4"><div class="marquee"><span>歡迎</span><span>Bienvenidos</span><span>Welcome</span><span>स्वागत हे</span><span>اهلا وسهلا</span><span>Bem-vinda</span><span>স্বাগত</span><span>добро пожаловать</span><span>ようこそ</span><span>Sugeng Rawuh</span><span>ਸਵਾਗਤ ਹੈ</span><span>Willkommen</span><span>어서 오십시오</span><span>Bienvenue</span><span>Karibu</span><span>Svāgatam</span><span>Hoşgeldiniz</span><span>خوش آمدید</span><span>வரவேற்பு</span><span>Hoan nghênh</span><span>اهلا وسهلا</span><span>Benvenuto</span></div></div>    
<div id="header">
    <h1 class="loading">Joey W. Schweickhardt</h1>
    <div id="nav">
        <a href="#/works">Works</a>
        <a href="#/places">Places</a>
        <a href="#/about">About</a>
    </div>
    <div>Stuttgart<span id="weather"></span><span id="time"></span></div>
</div>
<hr>


<div class="content" id="works">
    <div class="video">
        <video onclick="this.parentElement.classList.add('playing');this.setAttribute('controls','');this.setAttribute('autoplay','');this.setAttribute('preload','');" oncontextmenu="return false;" poster="img/other/landderechsen.jpg" tabindex="0" preload="none" controlsList="nodownload noplaybackrate" disablePictureInPicture>
            <source src="video/LandDerEchsen1080.mp4" type="video/mp4" />
            <source src="video/LandDerEchsen720.webm" type="video/webm" />
            <source src="https://www.dropbox.com/s/mmcykw5nus3m39u/LandDerEchsen1080.ogv?raw=1" type="video/ogg" />
        </video>
    </div>
    <p style="max-width:760px;">Land der Echsen, Germany, 2021. On the forgotten grounds of a derelict freight yard, a new urban quarter is in the making. For years, non-profit collectives have occupied the old loading halls &mdash; breathing life into the decaying space. But now, as redevelopment plans advance and demolition looms, they are forced to leave. Just then, an unexpected presence appears: lizards. Silent, enigmatic, and strangely defiant, they threaten to derail the entire project.</p>
    <p style="max-width:760px;">Born from <i>Anti-Stuttgart &mdash; A Determinate Negation</i>, a critical design studio at <a href="https://www.igma.uni-stuttgart.de/en/institute/">IGmA</a>, the Institute for Principles of Modern Architecture at the University of Stuttgart. The film reimagines urban development as a stage for ecological and political tension. Premiered at the University of Stuttgart&#8217;s architecture <a href="https://www.k1.live/">graduate exhibition</a> and featured at the <a href="https://www.current-stuttgart.de/">CURRENT Festival</a> for Art and Urban Space.</p>
    <hr>
    <div class="gallery">
        <img src="img/250610.jpg" alt="Urbach Tower Model with Transport Box<br>IntCDC" />
        <img src="img/240719.jpg" alt="Pauluskirche Extension<br>Interior" />
        <img src="img/240719-3.jpg" alt="Pauluskirche Extension<br>Urban Situation" />
        <img src="img/231005.jpg" alt="Helvetia Campus Basel<br>Facade Model<br>Herzog&nbsp;&&nbsp;de&nbsp;Meuron" />
        <img src="img/220311.jpg" alt="Lightweight Pavilions" />
        <img src="img/220311-2.jpg" alt="Pneu Concept" />
        <img src="img/210211.jpg" alt="Vasikkasaari Climate Institute Helsinki" />
        <img src="img/201018.jpg" alt="Wardrobe with Hand-sewn Curtain" />
        <img src="img/other/droneport.gif" alt="Droneport" />
        <img src="img/200125.jpg" alt="Light Studies Models" />
        <img src="img/191115.jpg" alt="Wooden Structure with Traction Cables" />
        <img src="img/190722.jpg" alt="Sint Aneke Club<br>Antwerp" />
        <img src="img/190926.jpg" alt="Glueless Model" />
        <img src="img/190208.jpg" alt="Cuboid Perspective" />
        <img src="img/190208-2.jpg" alt="Cuboid Perspective<br>Preparation" />
        <img src="img/190208-3.jpg" alt="Cuboid Axonometry" />
        <img src="img/190509.jpg" alt="Ruled Surfaces" />
        <img src="img/201202.jpg" alt="Pineapple, Etching" />
        <img src="img/181116-2.jpg" alt="Cup" />
        <img src="img/181130.jpg" alt="Tools" />
        <img src="img/181116.jpg" alt="Leichtsinn" />
    </div>
</div>
<div class="content" id="places">
    <div class="gallery">
        <img src="img/250610-2.jpg" alt="Stuttgart Marketplace" />
        <img src="img/241229.jpg" alt="San Pietro" />
        <img src="img/241215.jpg" alt="PR16" />
        <img src="img/230820.jpg" alt="Railway Engine Depot,<br>Herzog&nbsp;&&nbsp;de&nbsp;Meuron" />
        <img src="img/230114.jpg" alt="Sant&rsquo; Ireneo,<br>Mauro Galantino" />
        <img src="img/230109.jpg" alt="Via Albricci,<br>Asnago Vender" />
        <img src="img/230105.jpg" alt="Garden" />
        <img src="img/230104.jpg" alt="Nilufar Gallery" />
        <img src="img/221104.jpg" alt="Monte Amiata,<br>Carlo Aymonino" />
        <img src="img/221104-2.jpg" alt="Monte Amiata,<br>Carlo Aymonino" />
        <img src="img/221030.jpg" alt="Amendola,<br>Arrigo Arrighetti" />
        <img src="img/220915.jpg" alt="Emergence&nbsp;Pool,<br>Nari&nbsp;Ward" />
        <img src="img/220910.jpg" alt="ADI" />
        <img src="img/220904.jpg" alt="Clouds" />
        <img src="img/210102.jpg" alt="Creek" />
        <img src="img/190927.jpg" alt="Flora" />
        <img src="img/190317.jpg" alt="Death Valley" />
        <img src="img/190315.jpg" alt="Campfire in a Sandy Forest" />
        <img src="img/190311.jpg" alt="Salk Institute,<br>Louis Kahn" />
        <img src="img/180925.jpg" alt="Switzerland" />
        <img src="img/180524.jpg" alt="Eel Soup" />
        <img src="img/180512.jpg" alt="H&#432;&#x01A1;ng S&#x01A1;n" />
        <img src="img/170617.jpg" alt="Merano" />
        <img src="img/160811.jpg" alt="J&ouml;kuls&aacute;rl&oacute;n Glacial Lake" />
        <img src="img/160809.jpg" alt="Landmannalaugar" />
        <img src="img/160809-2.jpg" alt="Footprints" />
        <img src="img/160808.jpg" alt="N&yacute;idalur" />
        <img src="img/1.jpg" alt="Fog" />
    </div>
</div>
<div class="content" id="about">
    <!-- <h2>Professional</h2>
    <table>
        <tr><td data-title="01.05.2024-30.09.2024">2024-Present</td><td>IntCDC Cluster of Excellence, University of Stuttgart</td></tr>
        <tr><td data-title="01.03.2023-29.02.2024">2023&ndash;2024</td><td>Herzog & de Meuron</td></tr>
        <tr><td data-title="14.03.2023-09.09.2023">2022</td><td>Behnisch Architekten</td></tr>
        <tr><td data-title="25.10.2022-28.02.2023">2021&ndash;2022</td><td>REM ASSETS</td></tr>
        <tr><td data-title="01.10.2021-30.09.2022">2020&ndash;2021</td><td>Werner Sobek</td></tr>
    </table>
    <hr>
    <h2>Academic</h2>
    <table>
        <tr><td data-title="01.10.2021-">2021&ndash;Present</td><td>University of Stuttgart, Master Studies, Architecture and Urban Planning</td></tr>
        <tr><td data-title="05.09.2022-26.01.2023">2022&ndash;2023</td><td>Politecnico di Milano, Study Abroad, Architecture and Urban Design</td></tr>
        <tr><td data-title="15.07.2022-22.07.2022">2022</td><td>Architectural Association/State Academy of Fine Arts Stuttgart, Visiting School</td></tr>
        <tr><td data-title="01.10.2018-30.09.2021">2018&ndash;2021</td><td>University of Stuttgart, BSc Architecture and Urban Planning</td></tr>
    </table>
    <hr>
    <h2>Honors</h2>
    <table>
        <tr><td data-title="01.04.2023-31.03.2024">2023&ndash;2024</td><td>Deutschlandstipendium scholarship, Federal Republic of Germany/Ed. Züblin AG</td></tr>
        <tr><td data-title="01.03.2023-29.02.2024">2023&ndash;2024</td><td>Swiss-European Mobility Programme</td></tr>
        <tr><td data-title="05.09.2022-26.01.2023,01.03.2023-02.10.2023">2022&ndash;2023</td><td>Erasmus+ schoolarship</td></tr>
        <tr><td data-title="24.06.2022-04.07.2022">2022</td><td>Graduate Design Projects Selection, Department of Architecture, University of Stuttgart</td></tr>
        <tr><td data-title="16.09.2021-17.09.2021">2021</td><td>Film screening, CURRENT Festival for Art and Urban Space</td></tr>
        <tr><td data-title="13.01.2020-25.01.2020">2020</td><td>Annual Design Projects Selection, IRGE, University of Stuttgart</td></tr>
    </table>
    <hr> -->
    <p>
        Joey W. Schweickhardt<br>
        <span class="address1"></span><br>
        <span class="address2"></span><br>
        Germany
    </p>
    <p>
        <a class="phone" href="javascript:"></a><br>
        <a class="email" href="javascript:"></a>
    </p>
    <p>
        <!-- <a href="https://www.instagram.com/joeyws/">Instagram</a>, -->
        <a href="https://www.linkedin.com/in/joeyschweickhardt/">LinkedIn</a>
    </p>
    <hr>
    <div id="map"></div>
    <p>Image: NASA</p>
    <hr>
    <p id="website">
        This webpage doesn&rsquo;t use cookies.<br>
        Hosted on <a href="https://github.com/" rel="nofollow">GitHub</a><br>
        Initial launch: 2011/01<!-- /16 -->
    </p>
    <hr>
    <pre style="font-size:8px;line-height:1.2em;">
██████████████    ██        ██      ██████████████
██          ██  ████  ██████████    ██          ██
██  ██████  ██    ██████  ██    ██  ██  ██████  ██
██  ██████  ██  ████  ██  ██████    ██  ██████  ██
██  ██████  ██      ██  ██  ██  ██  ██  ██████  ██
██          ██  ██  ██    ████      ██          ██
██████████████  ██  ██  ██  ██  ██  ██████████████
                        ████                      
██████████  ██████████  ██  ████████  ██  ██  ██  
  ████  ████  ██  ██        ██    ██  ████      ██
████  ████  ████████  ████    ████████  ██  ██    
              ██████████        ██                
████    ██  ██    ██  ██      ████    ██████  ████
██    ██      ████  ██  ████    ██    ████        
██    ████  ██    ██      ████████████  ██  ██  ██
██    ██      ██    ██  ████    ██            ████
██  ██  ██  ██████      ██  ████████████████    ██
                ██████          ██      ██      ██
██████████████  ████  ████    ████  ██  ██  ██████
██          ██    ██  ██    ██████      ████      
██  ██████  ██  ████  ██        ████████████      
██  ██████  ██  ████    ██████  ████    ██    ████
██  ██████  ██  ████      ████    ██    ██  ██  ██
██          ██  ██      ████      ██████████  ██  
██████████████  ████    ██  ██              ██████</pre>
    <hr>
    <p class="toggle"><a href="javascript:">Privacy</a></p>
    <div class="p">
        <p>Personal data (usually referred to just as &ldquo;data&rdquo; below) will only be processed by us to the extent necessary and for the purpose of providing a functional and user-friendly website, including its contents, and the services offered there. Per Art. 4 No. 1 of Regulation (EU) 2016/679, i.e. the General Data Protection Regulation (hereinafter referred to as the &ldquo;GDPR&rdquo;), &ldquo;processing&rdquo; refers to any operation or set of operations such as collection, recording, organization, structuring, storage, adaptation, alteration, retrieval, consultation, use, disclosure by transmission, dissemination, or otherwise making available, alignment, or combination, restriction, erasure, or destruction performed on personal data, whether by automated means or not.</p>
        <p>With regard to the data processing to be described in more detail below, users and data subjects have the right to confirmation of whether data concerning them is being processed, information about the data being processed, further information about the nature of the data processing, and copies of the data (cf. also Art. 15 GDPR); to correct or complete incorrect or incomplete data (cf. also Art. 16 GDPR); to the immediate deletion of data concerning them (cf. also Art. 17 DSGVO), or, alternatively, if further processing is necessary as stipulated in Art. 17 Para. 3 GDPR, to restrict said processing per Art. 18 GDPR; to receive copies of the data concerning them and/or provided by them and to have the same transmitted to other providers/controllers (cf. also Art. 20 GDPR); to file complaints with the supervisory authority if they believe that data concerning them is being processed by the controller in breach of data protection provisions (see also Art. 77 GDPR). In addition, the controller is obliged to inform all recipients to whom it discloses data of any such corrections, deletions, or restrictions placed on processing the same per Art. 16, 17 Para. 1, 18 GDPR. However, this obligation does not apply if such notification is impossible or involves a disproportionate effort. Nevertheless, users have a right to information about these recipients.</p>
        <p>Likewise, under Art. 21 GDPR, users and data subjects have the right to object to the controller&rsquo;s future processing of their data pursuant to Art. 6 Para. 1 lit. f) GDPR. In particular, an objection to data processing for the purpose of direct advertising is permissible. Your data processed when using our website will be deleted or blocked as soon as the purpose for its storage ceases to apply, provided the deletion of the same is not in breach of any statutory storage obligations or unless otherwise stipulated below.</p>
        <p>This site is running on GitHub Pages. For more information, see <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement">GitHub privacy statement</a>.</p>
        <p><small>Weiß & Partner, Esslingen</small></p>
    </div>
</div>
<div class="content" id="sound">
    <h2>Music and sound design services</h2>
    <hr>
    Clients:<br>
    &bull; Kärcher<br>
    &bull; Smithsonian National Museum of Natural History<br>
    &bull; Kolping Bildung
    <hr>
    <iframe style="width:100%;max-width:760px;height:400px;" scrolling="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/130807438&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=false"></iframe>
</div>


<script src="scripts.js"></script>
<script>
$(document).ready(function(){

    // #loading
    function showLoading() {$(".loading").addClass("loading");}
	function hideLoading() {$(".loading").removeClass("loading");}

    // init
	$(window).on("load",function(){
        hideLoading();
        Marquee3k.init();
        refreshHash();
    });

    // nav
    function refreshHash() {
        var hash = window.location.hash;
        if ($("a[href='"+hash+"']").length == 0) {hash = $("#header a:first").attr("href");}
        $("a").removeClass("open");
        $("a[href='"+hash+"']").addClass("open");
        $("#" + hash.slice(2)).addClass("show").siblings(".content").removeClass("show");
        window.scrollTo(0,0);
        return false;
    }
    $(window).bind("hashchange",function(e){refreshHash();});
    
    // toggle section
    $(".toggle").on("click",function(){
        $(this).next().toggle();
    }).next().hide();

    // gallery
    $(".gallery img").each(function(){
        /* var date = $(this).attr("data-date").substr(-4);
        var date = (date != "") ? " ("+date+")" : ""; */
        var caption = $(this).attr("alt");
        $(this).wrap("<div></div>").after("<span><span>"+caption+"</span></span>");
    });
    // lightbox
    $("body").append("<div id='lightbox'><img src='' /></div>");
    function lightboxLoad() {
        var [fileName, fileExtension] = $(".gallery div.show img").attr("src").split('.');
        var imgURL = fileName + '_l.' + fileExtension;
        $("#lightbox").show().children("img").attr("src",imgURL);
    };
    function lightboxPrev() {
        if ($("#lightbox").is(":visible")) {
            if (!$(".gallery div:first-child").is(".show")) {
                $(".gallery div.show").removeClass("show").prev("div").addClass("show");
                lightboxLoad();
            }
        }
    };
    function lightboxNext() {
        if ($("#lightbox").is(":visible")) {
            if (!$(".gallery div:last-child").is(".show")) {
                $(".gallery div.show").removeClass("show").next("div").addClass("show");
                lightboxLoad();
            } else {
                lightboxClose();
            }
        }
    };
    function lightboxClose() {
        $("#lightbox").hide().children("img").attr("src","data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7");
        $(".gallery div.show").removeClass("show");
    };
    $(".gallery>div").on("click",function(){
        $(this).addClass("show");
        lightboxLoad();
    });
    $("#lightbox").on("click",function(e){
        lightboxClose();
    }).on("click","img",function(e){
        e.stopPropagation();
        lightboxNext();
    });

    // weather
    const getWeather = async () => {
        const request = await fetch("https://api.open-meteo.com/v1/forecast?latitude=48.7823&longitude=9.177&current_weather=true");
        const response = await request.json();
        $("#weather").html("&nbsp;&nbsp;" + Math.round(response.current_weather.temperature) + "&deg;C");
    }
    getWeather();
    setInterval(getWeather,60000);

    // time
    function getTime() {
        function addZero(i) {if (i < 10) {i = "0" + i;} return i;}
        var time = new Date();
        var h = time.getHours();
        // var h = addZero(time.getHours());
        // ampm = h >= 12 ? "pm" : "am";
        // h = h % 12;
        h = h ? h : 12;
        var min = addZero(time.getMinutes());
        var s = addZero(time.getSeconds());
        $("#time").html("&nbsp;&nbsp;" + h + "<span id='time-blink'>:</span>" + min);
    }
    getTime();
    setInterval(getTime,2000);

    // last updated
    $.getJSON("https://api.github.com/repos/"+"joeyws/joeyws.com/commits",function(json){
        $("#website").append( "<br>Last updated: " + json[0].commit.author.date.slice(0,-13).split("-")/* .reverse() */.join("/"));
    });
    
    // impressum
    var address1 = 'P'+'f'+'l'+'a'+'u'+'m'+'w'+'e'+'g'+' '+'1'+'4';
    var address2 = '7'+'0'+'3'+'7'+'4'+' '+'S'+'t'+'u'+'t'+'t'+'g'+'a'+'r'+'t';
    var mail = 'm'+'a'+'i'+'l'+ String.fromCharCode(64) +'j'+'o'+'e'+'y'+'w'+'s'+'.'+'c'+'o'+'m';
    var phone = '+'+'4'+'9'+'1'+'5'+'7'+'7'+'8'+'8'+'5'+'0'+'5'+'0'+'2';
    $('.address1').html(address1);
    $('.address2').html(address2);
    $('.email').append(mail).attr('href',String.fromCharCode(109)+'a'+'i'+'l'+'t'+'o'+':'+'Joey'+'%20'+'Schweickhardt'+'%20'+'%3C'+mail+'%3E');
    $('.phone').append(phone).attr('href','t'+'e'+'l'+':'+phone);
    // copy email
    $('.email').after(" <span></span>").hover(function(){
        $(this).next("span").html("copy");
    },function(){
        $(this).next("span").html("");
    }).click(function(){
        event.preventDefault();
        navigator.clipboard.writeText(mail).then(() => {
            $(this).next("span").html("copied");
        },() => {
            $(this).next("span").html("copying failed");
        });
    });

    // keyboard control
	$(document).keydown(function(e){
		if(!($("input,textarea").is(":focus"))) {
            //event.preventDefault();
			switch(e.which) {
			    case 27: lightboxClose(); break; // esc
				case 32: break; // space
				case 37: lightboxPrev(); break; // left
				case 39: lightboxNext(); break; // right
				default: return;
			}
		}
	});

});
</script>
</body>
</html>