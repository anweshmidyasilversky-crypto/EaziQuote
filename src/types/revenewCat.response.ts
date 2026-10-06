export interface RevenueCatPackage {
  identifier: string;
  platform_product_identifier: string;
  web_checkout_url?: string;
}

export interface RevenueCatLocalization {
  [key: string]: string;
}

export interface RevenueCatPaywallComponents {
  asset_base_url?: string;
  automatically_scale_font_size?: boolean;
  components_config?: Record<string, unknown>;
  components_localizations?: {
    [locale: string]: RevenueCatLocalization;
  };
  default_locale?: string;
  exit_offers?: Record<string, unknown>;
  haptic_feedback_enabled?: boolean;
  id?: string;
  play_store_product_change_mode?: Record<string, unknown>;
  revision?: number;
  state_declarations?: Record<string, unknown>;
  template_name?: string;
  zero_decimal_place_countries?: {
    apple?: string[];
    google?: string[];
  };
}

export interface RevenueCatOffering {
  description: string;
  identifier: string;
  metadata: Record<string, unknown> | null;
  packages: RevenueCatPackage[];
  paywall_components?: RevenueCatPaywallComponents;

  // RevenueCat can expose these on the offering/paywall response
  web_checkout_url?: string;
  web_checkout_urls?: {
    production?: string;
    sandbox?: string;
  };
}

export interface RevenueCatResponse {
  current_offering_id: string;
  custom_web_checkout_enabled: boolean;
  offerings: RevenueCatOffering[];

  placements?: {
    fallback_offering_id?: string;
  };

  targeting?: {
    revision?: number;
    rule_id?: string;
  };

  ui_config?: {
    app?: {
      colors?: Record<string, unknown>;
      fonts?: Record<string, unknown>;
    };
  };
}
