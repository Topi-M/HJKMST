*** Settings ***
Library    SeleniumLibrary

*** Variables ***
${URL}           http://localhost:5173/HJKMST/
${BROWSER}       firefox

*** Test Cases ***
Testaa Palapelin Koon Vaihtaminen 5x5 Kokoon
    Open Browser    ${URL}    ${BROWSER}
    Maximize Browser Window
    
    # 1. Navigointi
    Wait Until Element Is Visible    xpath://h5[contains(text(), 'Palapeli')]    timeout=10s
    Click Element    xpath://h5[contains(text(), 'Palapeli')]/following-sibling::button
    
    # 2. Avaa valikko ID:llä (kuten koodissasi määritelty)
    Wait Until Element Is Visible    id:puzzle-size-dropdown    timeout=10s
    Click Element    id:puzzle-size-dropdown
    
    # 3. PAKOTETTU VALINTA JAVASCRIPTILLÄ
    # Odotetaan sekunti, että React ehtii renderöidä listan
    Sleep    1s
    # Etsitään elementti, jossa on teksti 5x5, ja klikataan sitä JavaScriptillä
    ${element}=    Get Weapon Element    xpath://*[contains(text(), '5x5')]
    Execute Javascript    arguments[0].click();    ARGUMENTS    ${element}
    
    # 4. VARMISTUS
    # Tarkistetaan, että valikon teksti muuttui (label päivittyi koodissasi)
    Wait Until Element Contains    id:puzzle-size-dropdown    5x5    timeout=10s
    
    [Teardown]    Close Browser

*** Keywords ***
Get Weapon Element
    [Arguments]    ${xpath}
    Wait Until Element Is Visible    ${xpath}    timeout=5s
    ${el}=    Get WebElement    ${xpath}
    [Return]    ${el}