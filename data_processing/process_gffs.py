
import os, gzip
directory = "./genomes"

# Get list of files
files = os.listdir(directory)
from collections import defaultdict


import tqdm
output_directory = "../public/genomes"
import json
file_list = []
import pprint
for file in files:
    cds_dict = defaultdict(list)
    print(file)
    # If file is gzipped open it with gzip
    if file.endswith(".gz"):
                f = gzip.open(os.path.join(directory, file), 'rt')
    else:
                f = open(os.path.join(directory, file), 'rt')
    
    for line in tqdm.tqdm(f):
        # If this is not a primary transcript, skip it


        # If line starts with #, skip it
        if line.startswith("#"):
            continue
        # Split line into columns
        columns = line.split("\t")

        # If line is not a CDS, skip it
        if columns[2] != "CDS":
            continue
        # Get the key value pairs for this line
        key_value_pairs = columns[8].split(";")
        # Convert this to a dictionary
        key_value_pairs = {x.split("=")[0]: x.split("=")[1] for x in key_value_pairs}
        parent = key_value_pairs["Parent"]
        if (not (".1"  in parent)) and ("." in parent):
            continue
           
        # If parent is RNA, skip

        # Append dictionary of start, end, strand, and chromosome to the cds_dict
        cds_dict[parent].append({ "start": int(columns[3]), "end": int(columns[4]), "strand": columns[6], "chromosome": columns[0] })

    for gene in tqdm.tqdm(cds_dict):
        # Sort by start position, depending on strand
        if cds_dict[gene][0]["strand"] == "+":
            cds_dict[gene] = sorted(cds_dict[gene], key=lambda k: k["start"])
        else:
            cds_dict[gene] = sorted(cds_dict[gene], key=lambda k: k["start"], reverse=True)

        nucs_so_far = 0
        # Set the start and end position in the gene for each exon of the list
        for i,x in enumerate(cds_dict[gene]):
            x["zero-index-nuc-start"] = nucs_so_far
            x["zero-index-nuc-end"] = nucs_so_far + abs(x["end"] - x["start"])
        print("gene",gene)
        #pprint.pprint(cds_dict[gene])

        



    # dump the dictionary to a file
    outfile_name= file.replace(".gff", ".json").replace(".gz","")
    file_list.append(outfile_name)
    with open(os.path.join(output_directory, outfile_name), 'w') as outfile:
        json.dump(cds_dict, outfile)

with open(os.path.join(output_directory,"list.json"), 'w') as outfile:
    json.dump(file_list, outfile)


