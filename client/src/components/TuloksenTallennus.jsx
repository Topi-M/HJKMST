import { supabase } from './SupaBaseClient';

/**
 * 
 * @param {*} minigame_id Minigame id tietokannassa
 * @param {*} startTimeMs Mihin aikaan peli alkoi? Voi olla null
 * @param {*} endTimeMs Mihin aikaan peli loppui? Date.now(). Voi olla null
 * @param {*} difficulty Pelin vaikeusaste, katso tietokannasta -> difficulty
 * @param {*} score Valinnainen muuttuja, jos peli käyttää esim pisteitä ratkaistun ajan sijasta -> jos näin kutsu muodossa 
 * tallennaTulos (minigame_id, startTimeMs, EndTimeMs, difficulty, score = {Pelaajan pisteet}), näin ei laske ratkaistua aikaa.
 * @returns Lähettää Sisäänkirjautuneen käyttäjän scoren submission tauluun.
 */

export const tallennaTulos = async (minigame_id,startTimeMs, endTimeMs, difficulty = 'No_diff', score = null) => {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;

    const user = session?.user;
    if (!user) {
      return { success: false, message: 'Kirjaudu sisään tallentaaksesi tuloksen.' };
    }

     // Käytetään score, jos se on annettu; muuten lasketaan ratkaisu-aika
    const solveTimeMs = score != null ? score : endTimeMs - startTimeMs;

    // Insert into submission taulu supabase
    const { data, error } = await supabase
      .from('submission')
      .insert([{
        minigame_id: minigame_id,
        score: solveTimeMs,
        start_time_ms: startTimeMs,
        end_time_ms: endTimeMs,
        difficulty: difficulty
      }]); 

    if (error) {
      console.error('Tallennus epäonnistui:', error.message);
      return { success: false, error: error.message };
    }

    console.log('Tallennus onnistui:', data);
    return { success: true, data };
  } catch (err) {
    console.error('Virhe tallennusprosessissa:', err);
    return { success: false, error: err.message };
  }
};