export function cccAdr(SF, pmac, N, D, PL, K) {
    let ncount = {};
    let nmax = {};
    let SFmin = {};
    let SFtemp = {};
    let SFkj = {};

    // Calculate PL for each node in the list D
    // Sort D by PL
    // Based on PL split end devices into K groups
    // Split list to reduce the difference in received power

    for (let sf of SF) {
        ncount[sf] = 0;
        nmax[sf] = 1 / (2 * Math.log(1 - ToA(sf) / T) / pmac + 1);

        for (let k = 1; k <= K; k++) {
            let ck = selectUniqueChannel(k);

            for (let n of N) {
                SFmin[n] = Math.min({sf: Pn >= PminSF});
                SFtemp[n] = SFmin[n];

                for (let j = 1; j <= Nk; j++) {
                    let SFkj = assignSF(j, k);

                    if (ncount[SFtemp[n]] < nmax[SFtemp[n]]) {
                        SFkj[n] = SFtemp[n];
                        ncount[SFtemp[n]] = ncount[SFtemp[n]] + 1;
                    } else {
                        SFtemp[n] = SFtemp[n] + 1;

                        if (SFtemp[n] <= 12) {
                            j--;
                        }
                    }
                }

                if (ncount[sf] == N) {
                    return SFkj;
                }
            }
        }

        if (pmac > 0.01) {
            pmac = pmac - 0.01;
        }
    }
}
