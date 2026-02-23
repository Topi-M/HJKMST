*** Settings ***
Library    SeleniumLibrary

*** Variables ***
${URL}           http://localhost:5173/HJKMST/
${BROWSER}       firefox

*** Test Cases ***
Testaa Puuttuva Painike
    Open Browser    ${URL}    ${BROWSER}
    Maximize Browser Window
    
    # Navigoidaan palapeliin
    Wait Until Element Is Visible    xpath://h5[contains(text(), 'Palapeli')]
    Click Element    xpath://h5[contains(text(), 'Palapeli')]/following-sibling::button
    
    # ODOTETTU VIRHE: Etsitään nappia "Lopeta peli", jota ei ole olemassa
    # Tämä testi tulee "kaatumaan" tässä kohdassa
    Wait Until Element Is Visible    xpath://button[contains(., 'Lopeta peli')]    timeout=5s
    
    [Teardown]    Close Browser