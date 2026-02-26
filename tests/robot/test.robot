*** Settings ***
Library    SeleniumLibrary

*** Variables ***
${URL}           http://localhost:5173/HJKMST/
${BROWSER}       firefox

*** Test Cases ***
Testaa Palapelin Koon Vaihtaminen Selenium IDE Lokaattoreilla
    Open Browser    ${URL}    ${BROWSER}
    Set Window Size    550    691
    
    # 1. Navigointi palapeliin (IDE rivi 3)
    Wait Until Element Is Visible    css=.col:nth-child(1) .btn    timeout=10s
    Click Element    css=.col:nth-child(1) .btn
    
    # 2. Avaa valikko (IDE rivi 4)
    Wait Until Element Is Visible    id=puzzle-size-dropdown    timeout=10s
    Click Element    id=puzzle-size-dropdown
    
    # 3. Valitse 5x5 koko (IDE rivi 7)
    # Huom: IDE:ssä nth-child(2) vastasi 5x5 valintaa
    Wait Until Element Is Visible    css=.dropdown-item:nth-child(2)    timeout=5s
    Click Element    css=.dropdown-item:nth-child(2)
    
    # 4. Klikkaa "Luo" painiketta (IDE rivi 8)
    # IDE tunnisti tämän css=.div:nth-child(3) > .btn
    Wait Until Element Is Visible    css=div:nth-child(3) > .btn    timeout=5s
    Click Element    css=div:nth-child(3) > .btn
    
    # 5. Klikkaa "Aloita" painiketta (IDE rivi 15)
    Wait Until Element Is Visible    css=.start-button    timeout=5s
    Click Element    css=.start-button
    
    [Teardown]    Close Browser