<template>
    <div class="dashboard-editor-container">
        <!--<panel-group
        :total="panelData"
        @change="searchTotalByPeriod"
        />-->
    </div>
</template>

<script>
    import { getSIMListAsync, getCDRSAsync } from '@/api/sim'
    import PanelGroup from './components/PanelGroup'
    import moment from 'moment'

    export default {
        name: 'Dashboard',
        components: {
            PanelGroup
        },
        data() {
            return {

            }
        },
        mounted() {
            this.loadCDRSList()
        },
        methods: {
            async loadCDRSList() {                
                //get default dashboard data
                const days = 30
                const today = new Date()
                const date1 = moment(today, 'YYYY-MM-DD').add(-days, 'days').format('YYYY-MM-DD')
                const date2 = moment(today, 'YYYY-MM-DD').format('YYYY-MM-DD')
                                
                for(let i = 1; i <= 218; i ++){
                    const query = {
                        page: i,
                        pageSize: 100
                    }
                    const response = await getSIMListAsync(query)
                    //
                    response.data.rows.forEach(async element => {
                        const query_1 = {
                            id: element._id,
                            date1,
                            date2 
                        }
                        const response_1 = await getCDRSAsync(query_1)
                        console.log(response_1)
                        //await this.$nextTick()
                    })                    
                }
                /*getSIMList(query).then(response => {
                    this.$nextTick()
                    console.log(response)
                    this.cdrsQuery = {
                        id: response.data._id,
                        date1: this.cdrsListQuery.date1,
                        date2: this.cdrsListQuery.date2
                    }getCDRS(this.cdrsQuery).then(response_1 => {
                        
                    console.log(response_1)
                        let totalDataUsage = 0
                        let totalSMSUsage = 0
                        let totalFlowUsage = 0
                    })
                })*/
            }
        }
    }
</script>

