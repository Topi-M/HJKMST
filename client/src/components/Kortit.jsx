import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

const kuvat = ["kuva1.jpg", "kuva2.jpg", "kuva3.PNG", "kuva4.jpg", "kuva5.jpg", "kuva6.jpg"]

const cards = [...kuvat, ...kuvat].map((fileName, index) => {
  const { data } = supabase
    .storage
    .from("muistipeliKuvat")
    .getPublicUrl(fileName)

  return {
    id: index + 1,                 
    pairId: fileName,              
    name: fileName,
    image: data.publicUrl,
  }
})

export const cardsData = cards.map((card) => ({
  ...card,
  order: Math.floor(Math.random() * cards.length),
  isFlipped: false,
  passed: false
}));