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

// const nsps = { // from uniprot P0DTD1 orf1ab numbering of nsps
//   'nsp1': [1, 180],
//   'nsp2': [181, 818],
//   'nsp3': [819, 2763],
//   'nsp4': [2764, 3263],
//   'nsp5 (Mpro)': [3264, 3569],
//   'nsp6': [3570, 3859],
//   'nsp7': [3860, 3942],
//   'nsp8': [3943, 4140],
//   'nsp9': [4141, 4253],
//   'nsp10': [4254, 4392],
//   'nsp12 (RdRp)': [4393, 5324],
//   'nsp13': [5325, 5925],
//   'nsp14': [5926, 6452],
//   'nsp15': [6453, 6798],
//   'nsp16': [6799, 7096]
// }

const nsps = { // from uniprot P0DTD1 orf1ab numbering of nsps
  'nsp1': 1,
  'nsp2': 181,
  'nsp3': 819,
  'nsp4': 2764,
  'nsp5 (Mpro)': 3264,
  'nsp6': 3570,
  'nsp7': 3860,
  'nsp8': 3943,
  'nsp9': 4141,
  'nsp10': 4254,
  'nsp12 (RdRp)': 4393,
  'nsp13': 5325,
  'nsp14': 5926,
  'nsp15': 6453,
  'nsp16': 6799
}

function App() {

  let [codon, setCodon] = useState(484);
  let [nucleotide, setNucleotide] = useState(null);
  let [gene, setGene] = useState("S")
  let [nsp, setNsp] = useState("nsp6")
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
  let [nspCodon, setNspCodon] = useState(null);
  let [combinedCodon,setCombinedCodon] = useState(3646);

  if (combinedCodon == null) {
    if (orf1aorbcodon == null) {

      combinedCodon = nsps[nsp] + nspCodon - 1;
      
      if(combinedCodon > 4401) {
        orf1aorbcodon = nsps[nsp]+nspCodon-1-4401;
        orf1aorb = "ORF1b";
      }
      else {
        orf1aorbcodon = nsps[nsp]+nspCodon-1;
        orf1aorb = "ORF1a";
      }

    }
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

  if (nspCodon == null) {

    nsp="nsp1"
    nspCodon=combinedCodon - nsps[nsp] + 1

    for (const [key, value] of Object.entries(nsps)) {
      if (combinedCodon > value && combinedCodon - value < combinedCodon - nsps[nsp]) {
        nsp = key;
        nspCodon = combinedCodon - value + 1;
      }
    }
  }

  if (themode === "nucleotide") {
    if( ["ORF1a","ORF1b"].includes(gene)){
      if (orf1aorb !== gene){
      setOrf1aOrb(gene)
      setCombinedCodon(null)
      console.log("b")
    }
    if(orf1aorbcodon !== codon && !(isNaN(codon)&& isNaN(orf1aorb))) {
        console.log("c",codon,orf1aorbcodon)

      setORF1aorBCodon(codon)
      setCombinedCodon(null)
      }
    }

  }
  else{
    if(gene!==orf1aorb){
      console.log("d")
      setGene(orf1aorb)
      setNucleotide(null)
    }
    if (codon !== orf1aorbcodon && !(isNaN(codon)&& isNaN(orf1aorbcodon))){
      console.log("e")
      setCodon(orf1aorbcodon)
      setNucleotide(null)
    }
    
  }

  return (
    <div className="App">
      <h1>Codon2Nucelotide</h1>
      {themode==="nucleotide"&&
      <>
      <p class="bolded margined">Convert from SARS-CoV-2 codon position to genomic coordinates or vice versa</p>
      <p><button onClick={()=> {
  setthemode("orf1ab")
}}>Convert between ORF1a/b, ORF1ab, and polyprotein nsps</button></p></>
}

{themode==="orf1ab"&&
      <>
    
      <p class=" margined"><button onClick={()=> {
  setthemode("nucleotide")
}}>Convert from SARS-CoV-2 codon position to genomic coordinates or vice versa</button></p>
  <p class="bolded">Convert between ORF1a/b, ORF1ab, and polyprotein nsps</p>
  </>
}
      
     
      
    
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
          <div><a target="_blank" style={{color: "rgb(167, 167, 167)", marginTop:"10px", display:"block"}} href={"https://gensplore.theo.io/?gb=%2Fsequence.gb&search="+nucleotide}>View in Gensplore</a></div>
        </div>

      </div>
    }

    {themode==="orf1ab"&&
      <div className="flex-container">

      <div className="flex-child magenta">

        <h3>ORF1a or B </h3>
        <div style={{ marginBottom: "5px" }}> Gene: <select value={orf1aorb} onChange={e => { setOrf1aOrb(e.target.value); setORF1aorBCodon(orf1aorbcodon); setCombinedCodon(null); setNspCodon(null)}}>
          {['ORF1a','ORF1b'].sort().map(x =>
            <option key={x} value={x}>{x}</option>
          )}
        </select></div>

        Codon: <input type="number" value={orf1aorbcodon} onChange={e => {  setORF1aorBCodon(parseInt(e.target.value)); setOrf1aOrb(orf1aorb); setCombinedCodon(null); setNspCodon(null)}}></input>

      </div>

      <div className="flex-child green">

        <h3>ORF1ab </h3>

        Codon: <input type="number" value={combinedCodon} onChange={e => { setCombinedCodon(parseInt(e.target.value)); setORF1aorBCodon(null); setNspCodon(null)}}></input>

      </div>

      <div className="flex-child plaid">
        
        <h3>nsp </h3>

        <div style={{ marginBottom: "5px" }}> Gene: <select value={nsp} onChange={e => { setNsp(e.target.value); setNspCodon(nspCodon); setCombinedCodon(null); setORF1aorBCodon(null)}}>
          {Object.keys(nsps).map(x =>
            <option key={x} value={x}>{x}</option>
          )}
        </select></div>

        Codon: <input type="number" value={nspCodon} onChange={e => { setNspCodon(parseInt(e.target.value)); setNsp(nsp); setCombinedCodon(null); setORF1aorBCodon(null)}}></input>

      </div>

    </div>
}


<p class="margined"><a style={{color: "rgb(167, 167, 167)"}} href="https://github.com/theosanderson/codon2nucleotide">GitHub</a></p>

    </div >
  );
}

export default App;
