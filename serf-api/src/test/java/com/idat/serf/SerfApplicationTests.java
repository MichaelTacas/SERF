package com.idat.serf;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(
		properties = {
				"app.jwt.secret=AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",
				"app.admin.password="
		}
)
class SerfApplicationTests {

	@Test
	void contextLoads() {
	}
}