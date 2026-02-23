*** Settings ***
Library    SeleniumLibrary

*** Variables ***
${URL}           http://localhost:5173/HJKMST/
${BROWSER}       firefox

*** Test Cases ***
Vaihda Palapelin Kuva Testi
    Open Browser    ${URL}    ${BROWSER}
    Set Window Size    1312    887
    
    # 1. Mene palapeliin (Rivi 3 IDE:ssä)
    Wait Until Element Is Visible    css=.col:nth-child(1) .btn    timeout=10s
    Click Element    css=.col:nth-child(1) .btn
    
    # 2. ODOTA ETTÄ SIVU VAIHTUU (Tämä puuttui IDE:stä!)
    # Odotetaan, että jokin palapelisivun oma elementti (kuten Valitse kuva -nappi) ilmestyy
    Wait Until Page Contains    Valitse kuva    timeout=10s
    
    # 3. Avaa kuvanvalinta-overlay
    # Etsitään nappi tekstin perusteella tai CSS:llä jos IDE antoi sellaisen
    Click Element    xpath://button[contains(., 'Valitse kuva')]
    
    # 4. Valitse uusi kuva overlaysta
    # Tässä pitää odottaa että overlay on varmasti auki
    Wait Until Element Is Visible    css=.kuva-vaihtoehto    timeout=5s
    Click Element    css=.kuva-vaihtoehto:nth-child(1)

    [Teardown]    Close Browser