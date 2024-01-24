import {
  Header,
  Group,
  UnstyledButton,
  Box,
  rem,
  Menu,
  Text,
  Select,
} from '@mantine/core';
import { useDisclosure, } from '@mantine/hooks';
import {
  IconChevronDown,
  IconPlayerPause,
} from '@tabler/icons-react';
import { useStyles } from './Style';
import { IconUser } from '@tabler/icons-react';
import { IconLogout } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {useTranslation} from 'next-i18next'
import BreadcrumbTrail from '../BreadCrumbs';
import Link from 'next/link';
import { UserManagement } from '@/utils/UserManagement';
import Image from 'next/image';
import Cookies from 'js-cookie';


export const HeaderMenu = ({ breadcrumbs }) => {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const [username, setUsername] = useState(null)
  const { classes, theme ,cx} = useStyles();
  const router = useRouter();
  const { t,i18n } = useTranslation("common");
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const handleLogout = () => {
    const TOKEN_COOKIE = 'access_token';
    localStorage.clear();  
    Cookies.remove(TOKEN_COOKIE);
         router.push('/login');
  };

  useEffect(() => {
       let data = UserManagement.getItem('username')
       setUsername(data)
  }, [])
  
  const onToggleLanguageClick = (newLocale) => {
    const { pathname, asPath, query } = router
    router.push({ pathname, query }, asPath, { locale: newLocale })
  }
  const changeTo = router.locale === 'en' ? 'ja' : 'en'
  
  const currentLocale = router.locale || 'en';

  const languageOptions = [
    { value: 'en', label: 'English' }, 
    { value: 'ja', label: 'Japanese' },
  ];

  return (
    <Box>
      <Header height={60} px="md">
        <Group position="apart" sx={{ height: '100%' }}>
        <Group spacing={'4.3cm'} >
        <Image src="/seibuicon.png" alt="logo" width={70} height={45} priority/>  
        <BreadcrumbTrail breadcrumbs={breadcrumbs}/>
        </Group>
          <Menu
          width={260}
          position="bottom-end"
          transitionProps={{ transition: 'pop-top-right' }}
          onClose={() => setUserMenuOpened(false)}
          onOpen={() => setUserMenuOpened(true)}
          withinPortal
        >
        <Box className='header_endWrap' >
          <Box >
            {/* <Button className='language_btn' onClick={() => onToggleLanguageClick(changeTo)}>{t('Language', { changeTo })}</Button> */}
            <Select
            size='xs'
             className='selectbox'
             data={languageOptions}
             defaultValue={currentLocale} 
             onChange={(value) => onToggleLanguageClick(value)}/>
          </Box>
        <Box mt='.3rem'>
          <Menu.Target>
            <UnstyledButton
              className={cx(classes.user, { [classes.userActive]: userMenuOpened })} >
              <Group spacing={7}>
                <Text className={classes.icon_user} weight={500} size="sm" sx={{ lineHeight: 1 }} mr={3}>
                  {username}
                <IconChevronDown size={rem(12)} stroke={1.5} />
                </Text> 
              </Group>
            </UnstyledButton>
          </Menu.Target>
        </Box>
          <Menu.Dropdown>  
          <Link href='/user_profile' style={{textDecoration: 'none'}}> 
            <Menu.Item icon={<IconUser size="18" stroke={1.5} />}>
            {t('View Profile')}
            </Menu.Item>
            </Link>
            <Link href='/change_password' style={{textDecoration: 'none'}}> 
              <Menu.Item icon={<IconPlayerPause size="18" stroke={1.5} />}>
              {t('Change Password')}  
              </Menu.Item>
            </Link>
            <Menu.Item color="red" icon={<IconLogout size="18" stroke={1.5} />} onClick={() => handleLogout()}>
              {t('Log Out')}
            </Menu.Item>
          </Menu.Dropdown>
        </Box>  
        </Menu>
        </Group>
      </Header>
    </Box>
  );
}