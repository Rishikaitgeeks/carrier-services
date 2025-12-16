import '@shopify/ui-extensions/preact';
import { render } from "preact";
import { useState, useEffect } from "preact/hooks";
import { useAttributes, useApplyAttributeChange } from '@shopify/ui-extensions/checkout/preact';

export default async () => {
  render(<Extension />, document.body);
};

function Extension() {
  const attributes = useAttributes();
  const applyAttributeChange = useApplyAttributeChange();

  const getAttributeValue = (key) => {
    if (!attributes || !Array.isArray(attributes)) return '';
    const attr = attributes.find(a => a.key === key);
    return attr ? attr.value : '';
  };

  const savedValue = getAttributeValue('shipping_note');
  const [selectedValues, setSelectedValues] = useState(savedValue ? [savedValue] : []);

  useEffect(() => {
    const newValue = savedValue ? [savedValue] : [];
    if (JSON.stringify(newValue) !== JSON.stringify(selectedValues)) {
      setSelectedValues(newValue);
    }
  }, [savedValue]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const value = selectedValues.length > 0 ? selectedValues[0].trim() : '';
      if (value === '') {
        applyAttributeChange({
          type: "removeAttribute",
          key: "shipping_note"
        });
      } else {
        applyAttributeChange({
          type: "updateAttribute",
          key: "shipping_note",
          value: value
        });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [selectedValues, applyAttributeChange]);

  const options = ['1', '2', '3', '4'];

  const handleChange = (event) => {
    const newValues = event.currentTarget.values; // Always string[] - even for single select
    setSelectedValues(newValues);
  };

  return (
    <s-box>
      <s-stack gap="base">
        <s-heading>Shipping Note</s-heading>
        <s-choice-list
          values={selectedValues}
          onChange={handleChange}
          multiple={false}
        >
          {options.map((opt) => (
            <s-choice key={opt} value={opt}>
              Option {opt}
            </s-choice>
          ))}
        </s-choice-list>
      </s-stack>
    </s-box>
  );
}