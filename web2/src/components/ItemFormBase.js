import axios from 'axios';
import { getErrorMessage } from '@/lib/error';

export default {
  props: {
    itemId: [Number, String],
    projectId: [Number, String],
    needSave: Boolean,
    needReset: Boolean,
  },

  data() {
    return {
      item: null,
      formValid: false,
      formError: null,
      formSaving: false,
    };
  },

  async created() {
    await this.loadData();
  },

  computed: {
    isNew() {
      return this.itemId === 'new';
    },
  },

  watch: {
    async needSave(val) {
      if (val) {
        await this.save();
      }
    },
    async needReset(val) {
      if (val) {
        await this.reset();
      }
    },
  },

  methods: {
    async reset() {
      this.item = null;
      this.$refs.form.resetValidation();
      await this.loadData();
    },

    getItemsUrl() {
      throw new Error('Not implemented');
    },

    getSingleItemUrl() {
      throw new Error('Not implemented');
    },

    async loadData() {
      if (this.isNew) {
        this.item = {};
      } else {
        this.item = (await axios({
          method: 'get',
          url: this.getSingleItemUrl(),
          responseType: 'json',
        })).data;
      }
    },

    /**
     * Saves or creates user via API.
     * @returns {Promise<null>} null if validation didn't pass or user data if user saved.
     */
    async save() {
      this.formError = null;

      if (!this.$refs.form.validate()) {
        return;
      }

      this.formSaving = true;
      try {
        const item = (await axios({
          method: this.isNew ? 'post' : 'put',
          url: this.isNew
            ? this.getItemsUrl()
            : this.getSingleItemUrl(),
          responseType: 'json',
          data: this.item,
        })).data;

        this.$emit('save', {
          item,
          action: this.isNew ? 'new' : 'edit',
        });
      } catch (err) {
        this.formError = getErrorMessage(err);
      } finally {
        this.formSaving = false;
      }
    },
  },
};