import { useState, useEffect } from "react";
import {
  Page,
  Layout,
  Card,
  TextField,
  Button,
  Text,
  Banner,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

export const action = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const formData = await request.formData();
  const count = parseInt(formData.get("shippingCount") || "5");

  // MongoDB mein save karo
  const { ShopSettings } = await import("../models/shopSettings.model.js");
  await ShopSettings.findOneAndUpdate(
    { shop: session.shop },
    { shippingOptionsCount: count, updatedAt: new Date() },
    { upsert: true } // agar nahi hai to create kar do
  );

  return null;
};

export default function SettingsPage() {
  const [count, setCount] = useState("5");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Saved value load karo
    fetch("/api/get-shipping-count")
      .then((res) => res.json())
      .then((data) => {
        setCount(data.count.toString());
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <Page title="Custom Shipping Settings">
      <Layout>
        <Layout.Section>
          <Card>
            <Text variant="headingLg" as="h1">
              Shipping Options Count
            </Text>
            <br />
            <form method="post">
              <TextField
                label="Checkout pe kitne shipping options dikhane hai?"
                type="number"
                name="shippingCount"
                value={count}
                onChange={(v) => setCount(v)}
                min="1"
                max="10"
                helpText="Example: 3 daalte ho to sirf 3 options dikhenge"
                disabled={loading}
              />
              <br />
              <Button submit primary>
                Save Settings
              </Button>
            </form>
            <br />
            <Banner tone="info">
              <Text>
                Current: <strong>{count}</strong> shipping options checkout pe
                dikh rahe hain.
              </Text>
            </Banner>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}