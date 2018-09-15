/**
 * Translates all strings (labels) in a field layout config.
 *
 * @param {Array} config Field Layout config
 * @param {function} formatMessage Callback from react-intl to translate a string.
 *
 * @returns new translated field layout config.
 */
export default (config, formatMessage) => {
  const t = (str) => formatMessage({ id: str, defaultMessage: str });

  return config.map((layout) => ({
    ...layout,
    fields: layout.fields.map((field) => {
      const newField = { ...field };
      newField.label = t(field.label);
      if (newField.placeholder) {
        newField.placeholder = t(field.placeholder);
      }
      if (Array.isArray(newField.validation)) {
        newField.validation = field.validation.map(
          (rule) =>
            typeof rule === 'object'
              ? { ...rule, message: t(rule.message) }
              : rule
        );
      }
      if (Array.isArray(newField.options)) {
        newField.options = field.options.map((option) => ({
          ...option,
          label: t(option.label)
        }));
      }
      if (
        typeof newField.dataSource === 'object' &&
        Array.isArray(newField.dataSource.getOptions)
      ) {
        newField.dataSource.getOptions = field.dataSource.getOptions.map(
          (option) => ({
            ...option,
            label: t(option.label)
          })
        );
      }
      return newField;
    })
  }));
};
