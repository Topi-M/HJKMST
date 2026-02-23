*** Settings ***
Library    SeleniumLibrary

*** Variables ***
${URL}           http://localhost:5173/HJKMST/
${BROWSER}       firefox

*** Test Cases ***
Testaa Palapelin Koon Vaihtaminen
    Open Browser    ${URL}    ${BROWSER}
    Maximize Browser Window
    
    # 1. NAVIGOINTI: Pitää ensin mennä palapeliin
    Wait Until Element Is Visible    xpath://h5[contains(text(), 'Palapeli')]    timeout=10s
    Click Element    xpath://h5[contains(text(), 'Palapeli')]/following-sibling::button
    
    # 2. ODOTUS: Varmistetaan että palapeli-sivu latasi
    Wait Until Page Contains    Leaderboard    timeout=10s

    # 3. VALIKKO: Avataan pudotusvalikko
    Wait Until Element Is Visible    xpath://button[contains(., 'Valitse koko')]    timeout=5s
    Click Element    xpath://button[contains(., 'Valitse koko')]
    
    # 4. VALINTA: Klikataan 5x5 vaihtoehtoa
    # Huom: Bootstrap dropdownit vaativat usein juuri tämän 'dropdown-item' luokan
    Wait Until Element Is Visible    xpath://*[contains(@class, 'dropdown-item') and contains(text(), '5x5')]    timeout=5s
    Click Element    xpath://*[contains(@class, 'dropdown-item') and contains(text(), '5x5')]
    
    # 5. VARMISTUS: Tarkistetaan päivitys
    Wait Until Element Contains    xpath://button[contains(., 'Luo')]    5x5    timeout=5s
    
    [Teardown]    Close Browser