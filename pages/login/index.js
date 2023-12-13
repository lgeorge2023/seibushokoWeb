import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import instance from "../api/axiosInstance";
import { Alert, Select } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Container,
  Group,
  Button,
} from "@mantine/core";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { get } from "../api/apiUtils";
import Link from "next/link";
import { setToken } from "@/utils/cookieService";
import { UserManagement } from "@/utils/UserManagement";
import Cookies from "js-cookie";
const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
    alert: {
      show: false,
      message: "",
    },
  });
  const [isSubmitting,setIsSubmitting] = useState(false);

  const rememberedUser = Cookies.get("rememberedUser");
  const rememberedPassword = Cookies.get("rememberedPassword");
  useEffect(() => {
    if (rememberedUser) {
      setFormData((prevData) => ({ ...prevData, username: rememberedUser, rememberMe: true }));
    }
    if (rememberedPassword) {
      setFormData((prevData) => ({ ...prevData, password: atob(rememberedPassword) }));
    }
  }, [rememberedUser, rememberedPassword]);

  const router = useRouter();

  const fetchStaff = async () => {
    try {
      const data = await get("/staff/profile");
      UserManagement.setItem("id", data.id);
      UserManagement.setItem("profile_data", JSON.stringify(data));
    } catch (error) {
      console.error(error);
    }
  };

  const { t, i18n } = useTranslation("common");

  const handleSubmit = async (e) => {
    setIsSubmitting(true);
    e.preventDefault();
    const { username, password, rememberMe } = formData;
    try {
      const encodedPassword = btoa(password);
      const response = await instance.post("/auth/login/", {
        username,
        password: encodedPassword,
      });
      setFormData((prevData) => ({ ...prevData, alert: { show: false, message: "" } }));
      // Login successful
      setToken(response.data.access_token);
      UserManagement.setItem("token", response.data.access_token);
      UserManagement.setItem("username", username);
      if (rememberMe) {
        const thirtyDaysInSeconds = 30 * 24 * 60 * 60;
        Cookies.set("rememberedUser", username, {
          expires: thirtyDaysInSeconds,
        });
        Cookies.set("rememberedPassword", btoa(password), {
          expires: thirtyDaysInSeconds,
        });
      }
      await fetchStaff();
      router.push("/client_dashboard");
    } catch (error) {
      if (error.code === "ERR_NETWORK") {
        setFormData((prevData) => ({ ...prevData, alert: { show: true, message: "No response from server." } }));
      } else {
        setFormData((prevData) => ({ ...prevData, alert: { show: true, message: "No active account found with the given credentials." } }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };
  const onToggleLanguageClick = (newLocale) => {
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, { locale: newLocale });
  };
  const currentLocale = router.locale || 'en';

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'ja', label: 'Japanese' },
  ];
  return (
    <Container size={420} my={40}>
      <Title
        align="center"
        sx={(theme) => ({
          fontFamily: `Greycliff CF, ${theme.fontFamily}`,
          fontWeight: 900,
        })}
      >
        {t("login.welcome_back")}
      </Title>
      {formData.alert.show && (
        <Alert
          icon={<IconAlertCircle size="1rem" />}
          title="Error!"
          color="red"
        >
          {formData.alert.message}
        </Alert>
      )}
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <TextInput
          label={t('Username')}
          placeholder="Your Usename"
          required
          value={formData.username}
          onChange={(e) => setFormData((prevData) => ({ ...prevData, username: e.target.value }))}
          onKeyPress={handleKeyPress}
        />
        <PasswordInput
          label={t('Password')}
          placeholder="Your password"
          required
          mt="md"
          value={formData.password}
          onChange={(e) => setFormData((prevData) => ({ ...prevData, password: e.target.value }))}
          onKeyPress={handleKeyPress}
        />
        <Group position="apart" mt="lg">
          <Checkbox
            label={t("Remember me")}
            checked={formData.rememberMe}
            onChange={() => setFormData((prevData) => ({ ...prevData, rememberMe: !prevData.rememberMe }))}
          />
          <Link href="/forgot_password">
            <Anchor component="button" size="sm">
              {t("Forgot Password")}
            </Anchor>
          </Link>
        </Group>
        <Group style={{ marginTop: "13px", marginBottom: "-9px" }}>
          <Select
            size='xs'
            className='selectbox'
            data={languageOptions}
            defaultValue={currentLocale}
            onChange={(value) => onToggleLanguageClick(value)} />
        </Group>
        <Button fullWidth mt="xl" loading={isSubmitting} onClick={handleSubmit}>
          {t("Sign in")}
        </Button>
      </Paper>
    </Container>
  );
};
export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", ["common"])),
  },
});

export default Login;