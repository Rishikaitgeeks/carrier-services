import '@shopify/ui-extensions/preact';
import { render } from "preact";
import { useState, useEffect, useRef } from "preact/hooks";
import {
  useAttributes,
  useApplyAttributeChange
} from '@shopify/ui-extensions/checkout/preact';
import apiCAll from "../../services/api"
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
  const [selectedValues, setSelectedValues] = useState(
    savedValue ? [savedValue] : []
  );

  const [hasUserSelected, setHasUserSelected] = useState(false);

  const prevCountRef = useRef(0);

  useEffect(() => {
    const newValue = savedValue ? [savedValue] : [];
    if (JSON.stringify(newValue) !== JSON.stringify(selectedValues)) {
      setSelectedValues(newValue);
    }
  }, [savedValue]);

  useEffect(() => {
    if (!hasUserSelected) return;

    const timer = setTimeout(() => {
      const value =
        selectedValues.length > 0 ? selectedValues[0].trim() : '';

      if (!value) {
        applyAttributeChange({
          type: "removeAttribute",
          key: "shipping_note",
        });
      } else {
        applyAttributeChange({
          type: "updateAttribute",
          key: "shipping_note",
          value,
        });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [selectedValues, applyAttributeChange, hasUserSelected]);

  useEffect(() => {
    if (!hasUserSelected) return;

    const currentCount =
      selectedValues.length > 0 ? Number(selectedValues[0]) : 0;

    const prevCount = prevCountRef.current;

    if (prevCount > currentCount) {
      for (let i = currentCount + 1; i <= prevCount; i++) {
        applyAttributeChange({ type: "removeAttribute", key: `name_${i}` });
        applyAttributeChange({ type: "removeAttribute", key: `phone_${i}` });
      }
    }

    prevCountRef.current = currentCount;
  }, [selectedValues, applyAttributeChange, hasUserSelected]);


  const handleTextChange = (key) => (event) => {
    const value = event.detail.value;

    applyAttributeChange({
      type: value ? "updateAttribute" : "removeAttribute",
      key,
      value,
    });
  };

  const options = ['0', '1', '2', '3', '4'];

  const handleChange = async (event) => {
    setHasUserSelected(true);
    setSelectedValues(event.currentTarget.values);
    try {
      const token = await shopify.sessionToken.get();
      const API = new apiCAll();

      const res = await API.dataPass(selectedValues , token)
      
      console.log('Fetch response:', res);
    } catch (err) {
      console.error('Fetch error', err);
    }
  };

  const count =
    selectedValues.length > 0 ? Number(selectedValues[0]) : 0;


  return (
    <s-box>
      <s-stack gap="base">
        <s-heading>Add Extra Shipping Address</s-heading>

        <s-choice-list
          values={selectedValues}
          onChange={handleChange}
          multiple={false}
        >
          {options.map((opt) => (
            <s-choice key={opt} value={opt}>
              {opt}
            </s-choice>
          ))}
        </s-choice-list>

        {hasUserSelected && count > 0 &&
          Array.from({ length: count }).map((_, index) => (
            <s-box
              key={index}
              padding="base"
              border="base"
              border-radius="base"
            >
              <s-stack gap="base">
                <s-heading>Address {index + 1}</s-heading>

                <s-select
                  label="Country / Region"
                  value={getAttributeValue(`country_${index + 1}`) || 'US'}
                  onChange={handleTextChange(`country_${index + 1}`)}
                >
                  <s-option value="US">United States</s-option>
                  <s-option value="CA">Canada</s-option>
                  <s-option value="IN">India</s-option>
                </s-select>

                <s-stack direction="inline" gap="base">
                  <s-text-field
                    label="First name (optional)"
                    value={getAttributeValue(`first_name_${index + 1}`)}
                    onChange={handleTextChange(`first_name_${index + 1}`)}
                  />
                  <s-text-field
                    label="Last name"
                    value={getAttributeValue(`last_name_${index + 1}`)}
                    onChange={handleTextChange(`last_name_${index + 1}`)}
                  />
                </s-stack>

                <s-text-field
                  label="Address"
                  value={getAttributeValue(`address_${index + 1}`)}
                  onChange={handleTextChange(`address_${index + 1}`)}
                />

                <s-text-field
                  label="Apartment, suite, etc. (optional)"
                  value={getAttributeValue(`apartment_${index + 1}`)}
                  onChange={handleTextChange(`apartment_${index + 1}`)}
                />

                <s-stack direction="inline" gap="base">
                  <s-text-field
                    label="City"
                    value={getAttributeValue(`city_${index + 1}`)}
                    onChange={handleTextChange(`city_${index + 1}`)}
                  />
                  <s-text-field
                    label="State"
                    value={getAttributeValue(`state_${index + 1}`)}
                    onChange={handleTextChange(`state_${index + 1}`)}
                  />
                  <s-text-field
                    label="ZIP code"
                    value={getAttributeValue(`zip_${index + 1}`)}
                    onChange={handleTextChange(`zip_${index + 1}`)}
                  />
                </s-stack>
              </s-stack>
            </s-box>
          ))
        }
      </s-stack>
    </s-box>
  );
}
