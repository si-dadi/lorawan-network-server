// CCC-ADR Algorithm

// Step 0: Define input and output parameters

// Define the input parameters
let SF = [7, 8, 9, 10, 11, 12]; // Spreading factors
let pmac = 1; // Maximum packet error rate
let N = 10; // Number of nodes
let D = [1000, 200, 30, 40, 50, 60, 70, 80, 90, 100]; // Path loss values for each node
let K = 3; // Number of channels

// Define some constants (arbritrary values for testing)
// TODO: Implement the functions to compute these
let Pmin = -120000; // Minimum received power
let T = 0.01; // Time slot duration
let ToA = [0.041, 0.082, 0.164, 0.328, 0.656, 1.312]; // Time on air for each SF

// Define the output array
let SFn = []; // Spreading factor for each node


// Step 1: Calculate Pathloss for each node in D 
function calculatePL(D) {
  let PL = [];
  let d0 = 30;
  let Pl_d0 = 3.0 //arbritratry pathloss for a distance d0
  for (let i = 0; i < D.length; i++) {
    if(D[i] > d0)
    PL[i] = Pl_d0 + 10 * Math.log10(D[i]);
    else PL[i] = Pl_d0;

  }
  return PL;
}

// Step 2: Sort the list D by PL in ascending order
function sortDbyPL(D, PL) {
  let sortedD = [];
  let sortedPL = [];
  let indices = [];
  
  for (let i = 0; i < D.length; i++) {
    indices[i] = i;
  }
  
  indices.sort((a, b) => PL[a] - PL[b]);
  
  for (let i = 0; i < D.length; i++) {
    sortedD[i] = D[indices[i]];
    sortedPL[i] = PL[indices[i]];
  }
  
  return [sortedD, sortedPL];
}

// Step 3: Split the end devices into K groups based on PL
function splitGroups(D, PL, K) {
  let groups = [];
  let groupSize = Math.floor(D.length / K);
  let remainder = D.length % K;
  let start = 0;
  let end = 0;
  
  for (let k = 0; k < K; k++) {
    end = start + groupSize;
    if (remainder > 0) {
      end++;
      remainder--;
    }
    groups[k] = [];
    for (let i = start; i < end; i++) {
      groups[k].push([D[i], PL[i]]);
    }
    start = end;
  }
  //console.log(groups);
  
  return groups;
}

// Step 4: Split list to reduce the difference in received power
// TODO: Step 4


// Step 5: Implementing the for loop in the algorithm
n_sf = []; // 2d array with arrays for each spreading factor, each subarray has the indexes of the nodes which have that SF.
for(let i = 0; i < SF.length; i++){
    n_sf[i] = [];
    let lmax = Math.floor(0.5 * Math.log(pmac) / Math.log(1 - (ToA[i]) / T) + 1);
    // TODO: if n_sf[i].length > lmax then n_sf[i].length = lmax
}

// Select a unique channel for each group
function selectChannel(K) {
  let channels = [];
  for (let k = 0; k < K; k++) {
    channels[k] = k;
  }
  return channels;
}

// Assign a spreading factor to each node in each group
function assignSF(groups, channels, SF, pmac) {
  let SFn = [];
  let ncount = [];
  let nmax = [];
  for (let sf of SF) {
    ncount[sf] = 0;
    nmax[sf] = Math.floor(1 / (2 * Math.log(1 - ToA[sf - 7] / T) * pmac)) + 1;
  }
  for (let k = 0; k < groups.length; k++) {
    let ck = channels[k];
    for (let j = 0; j < groups[k].length; j++) {
      let Dk = groups[k][j][0];
      let PLk = groups[k][j][1];
      let SFmin = SF.find((sf) => 10 * Math.log10(Dk) - PLk >= Pmin);
      let SFtemp = SFmin;
      while (ncount[SFtemp] >= nmax[SFtemp]) {
        SFtemp++;
        if (SFtemp > 12) {
          break;
        }
      }
      if (SFtemp <= 12) {
        SFn.push([Dk, PLk, SFtemp, ck]);
        ncount[SFtemp]++;
      } else {
        SFn.push([Dk, PLk, null, ck]);
      }
    }
  }
  return SFn;
}

// Implement the algorithm
function CCC_ADR(SF, pmac, N, D, K) {
  let PL = calculatePL(D);
  let [sortedD, sortedPL] = sortDbyPL(D, PL);
  let groups = splitGroups(sortedD, sortedPL, K);
  let channels = selectChannel(K);
  let SFn = assignSF(groups, channels, SF, pmac);
  return SFn;
}

// Test the algorithm
console.log(CCC_ADR(SF, pmac, N, D, K));
