const tempGenerator = (htmlContent, type) => {
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
const avalonTemplate = `<div class="commXy">
    ${htmlContent}
</div>
`
    return type === 'avalon' ? avalonTemplate: vueTemplate;
}

module.exports = tempGenerator;