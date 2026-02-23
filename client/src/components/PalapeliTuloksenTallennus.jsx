import { supabase } from '../components/SupaBaseClient';

export const tallennaTulos = async (startTimeMs, endTimeMs, meta = {}) => {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;

    const user = session?.user;
    if (!user) {
      return { success: false, message: 'Kirjaudu sisään tallentaaksesi tuloksen.' };
    }

    // Laskee käytetyn ajan Ms
    const solveTimeMs = endTimeMs - startTimeMs;

    // Insert into submission taulu supabase
    const { data, error } = await supabase
      .from('submission')
      .insert([{
        minigame_id: 1,
        solve_time_ms: solveTimeMs,
        start_time_ms: startTimeMs,
        end_time_ms: endTimeMs,
        grid_size: meta.gridSize
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