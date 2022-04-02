import { Box, Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React from "react";
import { useMutation } from "urql";
import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";

type Props = {};

const REG_QL = `mutation($option: userDetails!){
  registerUser(option: $option) {
    error {
      field
      message
    }
    user {
      username
    }
  }
}`;

const register = (props: Props) => {
  const [, register] = useMutation(REG_QL);
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={(values) => {
          return register({ option: values });
        }}
      >
        {({ values, handleChange, isSubmitting }) => (
          <Form>
            <InputField
              name="username"
              placeholder="username"
              label="Username"
            />
            <Box mt={4}>
              <InputField
                name="password"
                placeholder="password"
                label="Password"
                type="password"
              />
            </Box>
            <Button
              mt={4}
              isLoading={isSubmitting}
              type="submit"
              colorScheme="teal"
            >
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default register;
