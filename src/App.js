
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


  return (
    <div className="App">
      <h1>Codon2Nucleotide</h1>
      <p>Convert from codon position to genomic coordinates, or vice versa. Currently for SARS-CoV-2. <a href="https://github.com/theosanderson/codon2nucleotide">GitHub</a></p>
      <div className="flex-container">

        <div className="flex-child magenta">

          <h3>Codon </h3>
          <div style={{ marginBottom: "5px" }}> Gene: <select value={gene} onChange={e => { setGene(e.target.value) }}>
            {Object.keys(genes).sort().map(x =>
              <option key={x} value={x}>{x}</option>



            )}
          </select></div>

          Codon: <input type="number" value={codon} onChange={e => { setCodon(parseInt(e.target.value)); setNucleotide(null) }}></input>



        </div>

        <div className="flex-child green">
          <h3>Nucleotide </h3>
          Nucleotide: <input type="number" value={nucleotide} onChange={e => { setNucleotide(parseInt(e.target.value)); setCodon(null); }}></input>
          {end_nucleotide && " to " + end_nucleotide}
        </div>

      </div>
    </div >
  );
}

export default App;
