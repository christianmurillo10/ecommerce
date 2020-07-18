<template>
  <div>
    <vue-html2pdf
      :show-layout="true"
      :enable-download="true"
      :preview-modal="true"
      :paginate-elements-by-height="800"
      filename="Sales Invoice"
      :pdf-quality="0"
      :manual-pagination="false"
      pdf-format="a4"
      pdf-orientation="landscape"
      pdf-content-width="800px"
      ref="html2Pdf"
    >
      <section slot="pdf-content">
        <!--
            Divide your content into section, this pdf-item will
            be the element that it's content will not be separated
            in the paginating process. ex. <h4> and <span> wont be separated.
        -->
        <section class="pdf-item">
          <h4>
            Title
          </h4>

          <span>
            Value
          </span>
        </section>

        <!--
            All other pdf-item will be separated in the pagination process,
            depending on paginate-elements-by-height prop.
        -->
        <section class="pdf-item">
          <h4>
            Title
          </h4>

          <span>
            Value
          </span>
        </section>

        <!--
            If you have any image with a remote source
            set html2canvas.useCORS to true, although it is set to true by default
            Ex.
            html2canvas: {
                useCORS: true
            }
        -->
        <section class="pdf-item">
        </section>
      </section>
    </vue-html2pdf>
  </div>
</template>

<script>
import VueHtml2pdf from "vue-html2pdf";

export default {
  components: {
    VueHtml2pdf,
  },

  methods: {
    /*
            Generate Report using refs and calling the
            refs function generatePdf()
        */
    generateReport() {
      this.$refs.html2Pdf.generatePdf();
    },
  },
};
</script>

<style lang="css" scoped>
.pdf-content {
  width: 100%;
  background: #fff;
}
</style>
