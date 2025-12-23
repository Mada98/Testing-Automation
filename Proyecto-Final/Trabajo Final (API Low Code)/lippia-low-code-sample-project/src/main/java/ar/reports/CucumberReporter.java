package ar.reports;

import com.aventstack.extentreports.cucumber.adapter.ExtentCucumberGenericAdapter;
import com.crowdar.driver.DriverManager;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;

public class CucumberReporter extends ExtentCucumberGenericAdapter {

    public CucumberReporter(String arg) {
        super(arg);
    }

    @Override
    public String getScreenshotBase64() {
        return  "No image";
    }

    @Override
    public Boolean isScreenshotDisable() {
        return true;
    }
}
