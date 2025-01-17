package io.atlasmap.itests.core.issue;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;

import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Paths;

import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;

import io.atlasmap.api.AtlasContext;
import io.atlasmap.api.AtlasSession;
import io.atlasmap.core.DefaultAtlasContextFactory;
import io.atlasmap.itests.core.TestHelper;

/**
 * https://issues.redhat.com/browse/ENTESB-16270 .
 */
public class ENTESB16270Test {

    private static final Logger LOG = LoggerFactory.getLogger(ENTESB16270Test.class);

    @Test
    public void test() throws Exception {
        URL url = Thread.currentThread().getContextClassLoader().getResource("mappings/issue/entesb-16270-mapping.json");
        AtlasContext context = DefaultAtlasContextFactory.getInstance().createContext(url.toURI());
        AtlasSession session = context.createSession();
        URL in = Thread.currentThread().getContextClassLoader().getResource("data/issue/entesb-16270-source.json");
        String source = new String(Files.readAllBytes(Paths.get(in.toURI())));
        session.setSourceDocument("-MYipd8jDixHjPa9gjIU", source);
        context.process(session);
        assertFalse(TestHelper.printAudit(session), session.hasErrors());
        Object target = session.getTargetDocument("-MYipkI9DixHjPa9gjIU");
        assertNotNull(target);
        LOG.info(target.toString());
        JsonNode root = new ObjectMapper().readTree(target.toString());
        ArrayNode arr = (ArrayNode) root.get("arr");
        assertEquals(5, arr.size());
        for (int i=0; i<arr.size(); i++) {
            JsonNode entry = arr.get(i);
            assertEquals("t" + i, entry.get("name").asText());
        }
    }

}
