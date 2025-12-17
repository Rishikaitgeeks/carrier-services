// import '@shopify/ui-extensions/preact';
// import { render } from "preact";
// import { useState, useEffect, useRef } from "preact/hooks";
// import {
//   useAttributes,
//   useApplyAttributeChange
// } from '@shopify/ui-extensions/checkout/preact';

// export default async () => {
//   render(<Extension />, document.body);
// };

// function Extension() {
//   const attributes = useAttributes();
//   const applyAttributeChange = useApplyAttributeChange();

//   const getAttributeValue = (key) => {
//     if (!attributes || !Array.isArray(attributes)) return '';
//     const attr = attributes.find(a => a.key === key);
//     return attr ? attr.value : '';
//   };

//   const savedValue = getAttributeValue('shipping_note');
//   const [selectedValues, setSelectedValues] = useState(
//     savedValue ? [savedValue] : []
//   );

//   const [hasUserSelected, setHasUserSelected] = useState(false);

//   const prevCountRef = useRef(0);

//   useEffect(() => {
//     const newValue = savedValue ? [savedValue] : [];
//     if (JSON.stringify(newValue) !== JSON.stringify(selectedValues)) {
//       setSelectedValues(newValue);
//     }
//   }, [savedValue]);

//   useEffect(() => {
//     if (!hasUserSelected) return;

//     const timer = setTimeout(() => {
//       const value =
//         selectedValues.length > 0 ? selectedValues[0].trim() : '';

//       if (!value) {
//         applyAttributeChange({
//           type: "removeAttribute",
//           key: "shipping_note",
//         });
//       } else {
//         applyAttributeChange({
//           type: "updateAttribute",
//           key: "shipping_note",
//           value,
//         });
//       }
//     }, 300);

//     return () => clearTimeout(timer);
//   }, [selectedValues, applyAttributeChange, hasUserSelected]);

//   useEffect(() => {
//     if (!hasUserSelected) return;

//     const currentCount =
//       selectedValues.length > 0 ? Number(selectedValues[0]) : 0;

//     const prevCount = prevCountRef.current;

//     if (prevCount > currentCount) {
//       for (let i = currentCount + 1; i <= prevCount; i++) {
//         applyAttributeChange({ type: "removeAttribute", key: `name_${i}` });
//         applyAttributeChange({ type: "removeAttribute", key: `phone_${i}` });
//       }
//     }

//     prevCountRef.current = currentCount;
//   }, [selectedValues, applyAttributeChange, hasUserSelected]);


//   const handleTextChange = (key) => (event) => {
//     const value = event.detail.value;

//     applyAttributeChange({
//       type: value ? "updateAttribute" : "removeAttribute",
//       key,
//       value,
//     });
//   };

//   const options = ['0','1', '2', '3', '4'];

//   const handleChange = (event) => {
//     setHasUserSelected(true);
//     setSelectedValues(event.currentTarget.values);
//   };

//   const count =
//     selectedValues.length > 0 ? Number(selectedValues[0]) : 0;


//   return (
//     <s-box>
//       <s-stack gap="base">
//         <s-heading>Add Extra Shipping Address</s-heading>

//         <s-choice-list
//           values={selectedValues}
//           onChange={handleChange}
//           multiple={false}
//         >
//           {options.map((opt) => (
//             <s-choice key={opt} value={opt}>
//               {opt}
//             </s-choice>
//           ))}
//         </s-choice-list>

//         {hasUserSelected && count > 0 &&
//           Array.from({ length: count }).map((_, index) => (
//             <s-box
//               key={index}
//               padding="base"
//               border="base"
//               border-radius="base"
//             >
//               <s-stack gap="base">
//                 <s-heading>Address {index + 1}</s-heading>

//                 <s-select
//                   label="Country / Region"
//                   value={getAttributeValue(`country_${index + 1}`) || 'US'}
//                   onChange={handleTextChange(`country_${index + 1}`)}
//                 >
//                   <s-option value="US">United States</s-option>
//                   <s-option value="CA">Canada</s-option>
//                   <s-option value="IN">India</s-option>
//                 </s-select>

//                 <s-grid gridTemplateColumns='1fr 1fr' gap="base">
//                   <s-grid-item gridColumn='span 1'>
//                     <s-text-field
//                       label="First name (optional)"
//                       value={getAttributeValue(`first_name_${index + 1}`)}
//                       onChange={handleTextChange(`first_name_${index + 1}`)}
//                     />
//                   </s-grid-item>
//                   <s-grid-item gridColumn='span 1'>
//                     <s-text-field
//                       label="Last name"
//                       value={getAttributeValue(`last_name_${index + 1}`)}
//                       onChange={handleTextChange(`last_name_${index + 1}`)}
//                     />
//                   </s-grid-item>
//                 </s-grid>

//                 <s-text-field
//                   label="Address"
//                   value={getAttributeValue(`address_${index + 1}`)}
//                   onChange={handleTextChange(`address_${index + 1}`)}
//                 />

//                 <s-text-field
//                   label="Apartment, suite, etc. (optional)"
//                   value={getAttributeValue(`apartment_${index + 1}`)}
//                   onChange={handleTextChange(`apartment_${index + 1}`)}
//                 />

//                 <s-grid gridTemplateColumns='1fr 1fr 1fr' gap="base">
//                   <s-grid-item gridColumn='span 1'>
//                   <s-text-field
//                     label="City"
//                     value={getAttributeValue(`city_${index + 1}`)}
//                     onChange={handleTextChange(`city_${index + 1}`)}
//                   /></s-grid-item>
//                   <s-grid-item gridColumn='span 1'>
//                   <s-text-field
//                     label="State"
//                     value={getAttributeValue(`state_${index + 1}`)}
//                     onChange={handleTextChange(`state_${index + 1}`)}
//                   /></s-grid-item>
//                   <s-grid-item gridColumn='span 1'>
//                   <s-text-field
//                     label="ZIP code"
//                     value={getAttributeValue(`zip_${index + 1}`)}
//                     onChange={handleTextChange(`zip_${index + 1}`)}
//                   /></s-grid-item>
//                 </s-grid>
//               </s-stack>
//             </s-box>
//           ))
//         }
//       </s-stack>
//     </s-box>
//   );
// }


import '@shopify/ui-extensions/preact';
import { render } from "preact";
import { useState, useEffect, useRef } from "preact/hooks";
import {
  useCartLines,
  useApplyCartLinesChange
} from '@shopify/ui-extensions/checkout/preact';

export default async () => {
  render(<Extension />, document.body);
};

function Extension() {
  const cartLines = useCartLines();
  const applyCartLinesChange = useApplyCartLinesChange();

  const cartLine = cartLines?.[0];

  const [selectedValues, setSelectedValues] = useState([]);
  const [hasUserSelected, setHasUserSelected] = useState(false);
  const prevCountRef = useRef(0);

  const getLineAttributeValue = (key) => {
    if (!cartLine) return '';
    const attr = cartLine.attributes?.find(a => a.key === key);
    return attr ? attr.value : '';
  };

  const savedValue = getLineAttributeValue('shipping_note');

  // 🔹 Sync saved value (page reload safe)
  useEffect(() => {
    if (!cartLine) return;
    if (!hasUserSelected) {
      setSelectedValues(savedValue ? [savedValue] : []);
    }
  }, [savedValue, cartLine]);

  // 🔹 Save shipping_note only after user action
  useEffect(() => {
    if (!cartLine || !hasUserSelected) return;

    applyCartLinesChange({
      type: "updateCartLine",
      id: cartLine.id,
      attributes: [{
        key: "shipping_note",
        value: selectedValues[0] || ""
      }],
    });
  }, [selectedValues, hasUserSelected, cartLine]);

  // 🔹 Cleanup removed addresses
  useEffect(() => {
    if (!cartLine || !hasUserSelected) return;

    const currentCount =
      selectedValues.length > 0 ? Number(selectedValues[0]) : 0;

    const prevCount = prevCountRef.current;

    if (prevCount > currentCount) {
      const attrsToClear = [];

      for (let i = currentCount + 1; i <= prevCount; i++) {
        [
          'country',
          'first_name',
          'last_name',
          'address',
          'apartment',
          'city',
          'state',
          'zip',
        ].forEach(field => {
          attrsToClear.push({
            key: `${field}_${i}`,
            value: ""
          });
        });
      }

      applyCartLinesChange({
        type: "updateCartLine",
        id: cartLine.id,
        attributes: attrsToClear,
      });
    }

    prevCountRef.current = currentCount;
  }, [selectedValues, hasUserSelected, cartLine]);

  // 🔹 Field change handler
  const handleTextChange = (key) => async (event) => {
    const value = event.detail.value;

    await applyCartLinesChange({
      type: "updateCartLine",
      id: cartLine.id,
      attributes: [{ key, value: value || "" }],
    });
  };

  const handleChange = (event) => {
    setHasUserSelected(true);
    setSelectedValues(event.currentTarget.values);
  };

  const options = ['0', '1', '2', '3', '4'];
  const count =
    selectedValues.length > 0 ? Number(selectedValues[0]) : 0;

  if (!cartLine) {
    return <s-text>Loading…</s-text>;
  }

  return (
    <s-box>
      <s-stack gap="base">
        <s-heading>Add Extra Shipping Address</s-heading>

        <s-choice-list
          values={selectedValues}
          onChange={handleChange}
          multiple={false}
        >
          {options.map(opt => (
            <s-choice key={opt} value={opt}>{opt}</s-choice>
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
                  value={getLineAttributeValue(`country_${index + 1}`) || 'US'}
                  onChange={handleTextChange(`country_${index + 1}`)}
                >
                  <s-option value="US">United States</s-option>
                  <s-option value="CA">Canada</s-option>
                  <s-option value="IN">India</s-option>
                </s-select>

                <s-grid gridTemplateColumns="1fr 1fr" gap="base">
                  <s-text-field
                    label="First name (optional)"
                    value={getLineAttributeValue(`first_name_${index + 1}`)}
                    onChange={handleTextChange(`first_name_${index + 1}`)}
                  />
                  <s-text-field
                    label="Last name"
                    value={getLineAttributeValue(`last_name_${index + 1}`)}
                    onChange={handleTextChange(`last_name_${index + 1}`)}
                  />
                </s-grid>

                <s-text-field
                  label="Address"
                  value={getLineAttributeValue(`address_${index + 1}`)}
                  onChange={handleTextChange(`address_${index + 1}`)}
                />

                <s-text-field
                  label="Apartment, suite, etc. (optional)"
                  value={getLineAttributeValue(`apartment_${index + 1}`)}
                  onChange={handleTextChange(`apartment_${index + 1}`)}
                />

                <s-grid gridTemplateColumns="1fr 1fr 1fr" gap="base">
                  <s-text-field
                    label="City"
                    value={getLineAttributeValue(`city_${index + 1}`)}
                    onChange={handleTextChange(`city_${index + 1}`)}
                  />
                  <s-text-field
                    label="State"
                    value={getLineAttributeValue(`state_${index + 1}`)}
                    onChange={handleTextChange(`state_${index + 1}`)}
                  />
                  <s-text-field
                    label="ZIP code"
                    value={getLineAttributeValue(`zip_${index + 1}`)}
                    onChange={handleTextChange(`zip_${index + 1}`)}
                  />
                </s-grid>
              </s-stack>
            </s-box>
          ))
        }
      </s-stack>
    </s-box>
  );
}
