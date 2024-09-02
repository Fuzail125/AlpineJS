function App() {
    return {
        page: 1,
        index:0,
        years:[],
        semester:[],
        batches:[],
        probations:[],
        selectedYear:'',
        selectedSemester:'',
        selectedBatch:'',
        getProbationRate:'',

        async getYears() {
            const years = (await fetch('/api/years').then(res => res.json()));
            this.years = years;
        },
        async getSemester(year) {
            this.selectedYear = year;
            this.index=1;
            const semester = (await fetch(`/api/semester/${year}`).then(res => res.json()));
            this.semester = semester;
        },
        async getBatch(sem) {
            this.selectedSemester = sem;
            const batches = await fetch(`/api/batch/${this.selectedYear}/${sem}`).then(res => res.json());
            this.index=2;
            this.batches = batches;
        },
        async getProbationRate(batch) {
            this.selectedBatch = batch;
            const probations = await fetch(`/api/probation/${this.selectedYear}/${this.selectedSemester}/${batch}`)
                .then(res => res.json());
            this.index=3;
            this.probations = probations;
        }
        // async getRecap(batch){
        //     const encodedBatch = encodeURIComponent(batch);
        //     const recaps = await fetch(`/api/recap/${this.selectedYear}/${this.selectedSemester}/${encodedBatch}`)
        //         .then(res => res.json());
        //     this.index=3;
        //     this.recaps = recaps;
        // }
    
    }
}