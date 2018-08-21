<template>
    <Layout class="access views">
        access
        <select name="" id="aa" v-model="selected">
            <option :value="i.regionCode" v-for="i in region" :key="i.id">{{ i.name }}</option>
        </select>
    </Layout>
</template>
<script>
export default {
    data () {
        return {
            selected:'11,11,01',
            region: [
                {
                    name:'北京',
                    regionCode: '11,11,01'
                },
                {
                    name:'上海',
                    regionCode: '21,11,01'
                }
            ]
        }
    },
    watch: {
        selected (a) {
            console.log(a)
        }
    }
}
</script>
