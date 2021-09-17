
import React, { useState, useEffect } from 'react';

import Select from 'react-select'


import './App.css';



function App() {
  let [listOfGenomes, setListofGenomes] = useState([]);
  let [genome, setGenome] = useState('');
  useEffect(() => {
    if (listOfGenomes.length == 0) {
      fetch('/genomes/list.json')
        .then(response => response.json())
        .then(json => {
          setListofGenomes(json)
        })
    }



  }
    , []);

  let [genomeData, setGenomeData] = useState({});

  // If genome data is empty, and a genome is selected, fetch the data
  useEffect(() => {
    if (Object.keys(genomeData).length == 0 && genome != '') {
      fetch('/genomes/' + genome)
        .then(response => response.json())
        .then(json => {
          setGenomeData(json)
          window.gd = json
          console.log('woo')
        })
    }
  }, []);

  let gene_names = Object.keys(genomeData).sort();

  let [codon, setCodon] = useState(484);
  let [nucleotide, setNucleotide] = useState(null);
  let [gene, setGene] = useState("")
  let end_nucleotide = ""

  if (gene != "") {

    if (nucleotide == null) {
      const start_nucleotide = genomeData[gene][0] + (codon - 1) * 3
      end_nucleotide = start_nucleotide + 2
      nucleotide = start_nucleotide
    }


    if (codon == null) {
      const matches = Object.keys(genomeData).filter(x => genomeData[x][0] <= nucleotide & genomeData[x][1] >= nucleotide)
      if (matches.length === 1) {
        console.log(matches)

        gene = matches[0]
        const the_start = genomeData[gene][0]
        codon = Math.floor((nucleotide - the_start) / 3) + 1
      }
      else {
        codon = "!!"
      }
    }

  }
  return (
    <div className="App">
      <h1>Codon2Nucleotide</h1>
      <p>Convert from codon position to genomic coordinates, or vice versa. Currently for SARS-CoV-2. <a href="https://github.com/theosanderson/codon2nucleotide">GitHub</a></p>
      <select value={genome} onChange={e => setGenome(e.target.value)}>
        {listOfGenomes.map(x => <option key={x} value={x}>{x.replace(".json", "")}</option>)}
      </select>
      <div className="flex-container">

        <div className="flex-child magenta">

          <h3>Codon </h3>
          <div style={{ marginBottom: "5px" }}> Gene:
            <Select options={gene_names.map(x => ({ label: x, value: x }))} value={gene} onChange={e => setGene(e)} />
          </div>

          Codon: <input type="number" value={codon} onChange={e => { setCodon(parseInt(e.target.value)); setNucleotide(null) }}></input>



        </div>

        <div className="flex-child green">
          <h3>Nucleotide </h3>
          Nucleotide: <input type="number" value={nucleotide} onChange={e => { setNucleotide(parseInt(e.target.value)); setCodon(null); }}></input>
          <div className="to_sec">{end_nucleotide && " to " + end_nucleotide}</div>
        </div>

      </div>
    </div >
  );
}

export default App;
