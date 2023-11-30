import { Breadcrumbs, Text } from '@mantine/core';
import { IconHome2 } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const BreadcrumbTrail = ({ breadcrumbs }) => {
  const router = useRouter();

  const handleBreadcrumbClick = (link) => {
    router.push(link);
  };

  return (
    <Breadcrumbs>
      <Link href="/client_dashboard">
        <IconHome2 size={16} color="blue" />
      </Link>
      {breadcrumbs.map((breadcrumb, index) => (
        index === breadcrumbs.length - 1 ? (
          <Text key={index} component="span" size={13} color="blue">
            {breadcrumb.label}
          </Text>
        ) : (
          <Text
            key={index}
            // component="a"
            onClick={() => handleBreadcrumbClick(breadcrumb.link)}
            size={13}
            color="blue"
            style={{ textDecoration: 'none', cursor: 'pointer' }}
            onMouseEnter={(e) => {
              e.target.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.target.style.textDecoration = 'none';
            }}
          >
            {breadcrumb.label}
          </Text>
        )
      ))}
    </Breadcrumbs>
  );
};

export default BreadcrumbTrail;
