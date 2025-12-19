const tempGenerator = (htmlContent) => {
const vueTemplate = `<template>
    <div>
        ${htmlContent}
    </div>
</template>

<script>

export default {
    props: {
        agreeData: {
            type: Object,
            default() {
                return {};
            }
        }
    }
};
</script>`
    return vueTemplate;
}

module.exports = tempGenerator;