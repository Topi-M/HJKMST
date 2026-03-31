import React from 'react';

const MicrosoftFormEmbed = () => {
  return (
    /* Container hoitaa sen, että lomake täyttää leveyden ja on tarpeeksi korkea */
    <div className="form-container" style={{ width: '100%', height: '100vh', display: 'flex', justifyContent: 'center' }}>
      <iframe 
        // Muutetaan width prosentiksi (100%) ja height kattamaan koko ruutu
        width="100%" 
        height="100%" 
        src="https://forms.office.com/Pages/ResponsePage.aspx?id=Lp-HhwRz8ku68mPn-D88NKI5_eDr5S9HuF5vMmtsD8NUM01DRzUyTDQwRlI3RUJQS1hMSzZCSDBLRy4u&embed=true" 
        frameBorder="0" 
        marginWidth="0" 
        marginHeight="0" 
        style={{ border: 'none', maxWidth: '100%' }} 
        allowFullScreen 
        webkitallowfullscreen="true" 
        mozallowfullscreen="true" 
        msallowfullscreen="true"
        title="Microsoft Form"
      > 
        Ladataan...
      </iframe>
    </div>
  );
};

export default MicrosoftFormEmbed;