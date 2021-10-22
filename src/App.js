
import React, { useState } from 'react';




import './App.css';

const genes = {
  'ORF1a': [266, 13467],
  'ORF1b': [13468, 21556],
  'S': [21563, 25385],
  'ORF3a': [25393, 26221],
  'E': [26245, 26473],
  'M': [26523, 27192],
  'ORF6': [27202, 27388],
  'ORF7a': [27394, 27760],
  'ORF7b': [27756, 27888],
  'ORF8': [27894, 28260],
  'N': [28274, 29534],
  'ORF10': [29558, 29675]
}


function App() {
  let [codon, setCodon] = useState(484);

  let [nucleotide, setNucleotide] = useState(null);
  let [gene, setGene] = useState("S")
  let [themode,setthemode] = useState("nucleotide")
  let end_nucleotide = ""




  if (nucleotide == null) {
    const start_nucleotide = genes[gene][0] + (codon - 1) * 3
    end_nucleotide = start_nucleotide + 2
    nucleotide = start_nucleotide
  }


  if (codon == null) {
    const matches = Object.keys(genes).filter(x => genes[x][0] <= nucleotide & genes[x][1] >= nucleotide)
    if (matches.length === 1) {
      console.log(matches)

      gene = matches[0]
      const the_start = genes[gene][0]
      codon = Math.floor((nucleotide - the_start) / 3) + 1
    }
    else {
      codon = "!!"
    }
  }

  let [orf1aorb, setOrf1aOrb] = useState(null);
  let [orf1aorbcodon, setORF1aorBCodon] = useState(null);
  let [combinedCodon,setCombinedCodon] = useState(5005);

  if (combinedCodon == null) {
    combinedCodon = orf1aorbcodon + (orf1aorb === "ORF1b" ? 4401 : 0)
  }
  else{
    if(combinedCodon > 4401){
      orf1aorbcodon = combinedCodon - 4401
      orf1aorb = "ORF1b"
    }
    else{
      orf1aorb = "ORF1a"
      orf1aorbcodon = combinedCodon
      
    }
  }

  if (themode === "nucleotide") {
    if( ["ORF1a","ORF1b"].includes(gene)){
      if (orf1aorb !== gene){
      setOrf1aOrb(gene)
      setCombinedCodon(null)
    }
      if(orf1aorbcodon !== codon){
      setORF1aorBCodon(codon)
      setCombinedCodon(null)
      }
    }

  }
  else{
    if(gene!==orf1aorb){
      setGene(orf1aorb)
      setNucleotide(null)
    }
    if (codon !== orf1aorbcodon){
      setCodon(orf1aorbcodon)
      setNucleotide(null)
    }
    
  }

  return (
    <div className="App">
      <h1>Codon2Nucleotide</h1>
      <p>Convert from codon position to genomic coordinates, or vice versa. Currently for SARS-CoV-2. <a href="https://github.com/theosanderson/codon2nucleotide">GitHub</a></p>
      {themode==="nucleotide"&&
      <div className="flex-container">

        <div className="flex-child magenta">

          <h3>Codon </h3>
          <div style={{ marginBottom: "5px" }}> Gene: <select value={gene} onChange={e => { setGene(e.target.value); setCodon(codon); setNucleotide(null) }}>
            {Object.keys(genes).sort().map(x =>
              <option key={x} value={x}>{x}</option>



            )}
          </select></div>

          Codon: <input type="number" value={codon} onChange={e => { setCodon(parseInt(e.target.value)); setNucleotide(null) }}></input>



        </div>

        <div className="flex-child green">
          <h3>Nucleotide </h3>
          Nucleotide: <input type="number" value={nucleotide} onChange={e => { setNucleotide(parseInt(e.target.value)); setCodon(null); }}></input>
          <div className="to_sec">{end_nucleotide && " to " + end_nucleotide}</div>
        </div>
        

      </div>
}

      {themode==="orf1ab"&&
      <div className="flex-container">


<div className="flex-child magenta">

  <h3>ORF1a or B </h3>
  <div style={{ marginBottom: "5px" }}> Gene: <select value={orf1aorb} onChange={e => { setOrf1aOrb(e.target.value); setORF1aorBCodon(codon); setCombinedCodon(null) ;  }}>
    {['ORF1a','ORF1b'].sort().map(x =>
      <option key={x} value={x}>{x}</option>



    )}
  </select></div>

  Codon: <input type="number" value={orf1aorbcodon} onChange={e => { setORF1aorBCodon(parseInt(e.target.value)); setOrf1aOrb(orf1aorb) ;setCombinedCodon(null) ;}}></input>



</div>

<div className="flex-child green">
  <h3>ORF1ab </h3>
  Codon: <input type="number" value={combinedCodon} onChange={e => { setCombinedCodon(parseInt(e.target.value)); setORF1aorBCodon(null);  }}></input>

</div>


</div>
}

<p><button onClick={()=> {
  setthemode(themode==="nucleotide"?"orf1ab":"nucleotide")
}}>{themode==="orf1ab"?  <span>Switch to codon / nucleotide mode</span>: <span>Switch to ORF1a/b:ORF1ab conversion</span>}</button></p>

    </div >
  );
}

export default App;
